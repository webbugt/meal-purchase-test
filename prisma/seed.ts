import { PrismaClient } from '@prisma/client'
import { labelsData, drinksData, mealsData } from './seed_data'

type Truthy<T> = T extends false | '' | 0 | null | undefined ? never : T; // from lodash

function truthy<T> (value: T): value is Truthy<T> {
  return !!value
}

const prisma = new PrismaClient()
async function main () {
  const existingLabels = await prisma.label.findMany()
  const missingLabels = labelsData.filter(
    (label) => !existingLabels.some((l) => l.title === label)
  )
  if (missingLabels.length) {
    await prisma.label.createMany({
      data: missingLabels.map((label) => ({
        title: label
      }))
    })
  }
  const labelEntities = missingLabels.length
    ? await prisma.label.findMany()
    : existingLabels

  const existingDrinks = await prisma.drink.findMany()
  const missingDrinks = drinksData.filter(
    (drink) => !existingDrinks.some((d) => d.title === drink.title)
  )
  if (missingDrinks.length) {
    await prisma.drink.createMany({
      data: missingDrinks.map((drink) => ({
        title: drink.title,
        price: drink.price
      }))
    })
  }
  const drinkEntities = missingDrinks.length
    ? await prisma.drink.findMany()
    : existingDrinks

  const existingMeals = await prisma.meal.findMany()
  const missingMeals = mealsData.filter(
    (meal) => !existingMeals.some((m) => m.title === meal.title)
  )
  if (missingMeals.length) {
    await Promise.all(
      missingMeals.map((meal) => {
        const labels = meal.labels
          .map((label) =>
            labelEntities.find((entity) => entity.title === label)
          )
          .filter(truthy)

        const drinks = meal.drinks
          .map((drink) =>
            drinkEntities.find((entity) => entity.title === drink)
          )
          .filter(truthy)

        return prisma.meal.create({
          data: {
            title: meal.title,
            starter: meal.starter,
            desert: meal.desert,
            price: meal.price,
            img: meal.img,
            labels: {
              create: labels.map(({ id }) => ({
                label: {
                  connect: {
                    id
                  }
                }
              }))
            },

            drinks: {
              create: drinks.map(({ id }) => ({
                drink: {
                  connect: {
                    id
                  }
                }
              }))
            }
          }
        })
      })
    )
  }
  console.log(`Seeded database with:
    ${missingMeals.length} new meals, ${existingMeals.length} exist,
    ${missingLabels.length} new labels, ${existingLabels.length} exist,
    ${missingDrinks.length} new drinks, ${existingDrinks.length} exist`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
