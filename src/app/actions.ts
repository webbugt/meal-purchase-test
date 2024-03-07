'use server'
import prisma from '@/lib/db'
import { MealFormValues } from '@/components/forms/meal-form'

export async function getMeals () {
  const meals = await prisma.meal.findMany({
    include: {
      labels: {
        include: {
          label: true
        }
      },
      drinks: {
        include: {
          drink: true
        }
      }
    }
  })

  return meals.map((meal) => {
    const reducedMeal = {
      ...meal,
      labels: meal.labels.map((label) => label.label),
      drinks: meal.drinks.map((drink) => drink.drink)
    }
    return reducedMeal
  })
}

export async function createMeal (meal: MealFormValues) {
  const [labels, drinks] = await Promise.all([
    prisma.label.findMany({
      where: {
        id: {
          in: (meal.labels || [])
        }
      }
    }),
    prisma.drink.findMany({
      where: {
        id: {
          in: (meal.drinks || [])
        }
      }
    })
  ])
  await prisma.meal.create({
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
}
