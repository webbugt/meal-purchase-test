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

export async function getMeal (mealId: number) {
  const meal = await prisma.meal.findUnique({
    where: {
      id: mealId
    },
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
  if (!meal) return null
  // @TODO: implement many-to-many mapper
  return {
    ...meal,
    labels: meal.labels.map((label) => label.label),
    drinks: meal.drinks.map((drink) => drink.drink)
  }
}

export async function updateMeal (mealId: number, meal: MealFormValues) {
  // const mealId = meal.id
  const [labels, drinks, labelsOnMeal, drinksOnMeal] = await Promise.all([
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
    }),
    prisma.labelOnMeal.findMany({
      where: {
        mealId
      }
    }),
    prisma.drinkOnMeal.findMany({
      where: {
        mealId
      }
    })
  ])

  const labelsToAdd = labels.filter(({ id }) => !(labelsOnMeal.map(({ labelId }) => labelId).includes(id)))
  const labelsToRemove = labelsOnMeal.filter(({ labelId }) => !(meal?.labels || []).includes(labelId))

  const drinksToAdd = drinks.filter(({ id }) => !(drinksOnMeal.map(({ drinkId }) => drinkId).includes(id)))
  const drinksToRemove = drinksOnMeal.filter(({ drinkId }) => !(meal?.drinks || []).includes(drinkId))

  await Promise.all([
    // prisma.labelOnMeal.deleteMany({
    //   where: {
    //     labelId: {
    //       in: labelsToRemove.map((label) => label.labelId)
    //     },
    //     mealId
    //   }
    // }),
    // prisma.drinkOnMeal.deleteMany({
    //   where: {
    //     drinkId: {
    //       in: drinksToRemove.map((drink) => drink.drinkId)
    //     },
    //     mealId
    //   }
    // }),
    prisma.meal.update({
      where: {
        id: mealId
      },
      data: {
        title: meal.title,
        starter: meal.starter,
        desert: meal.desert,
        price: meal.price,
        img: meal.img,
        labels: {
          deleteMany: {
            labelId: {
              in: labelsToRemove.map((label) => label.labelId)
            },
            mealId
          },
          create: labelsToAdd.map(({ id }) => ({
            label: {
              connect: {
                id
              }
            }
          }))
        },
        drinks: {
          deleteMany: {
            drinkId: {
              in: drinksToRemove.map((drink) => drink.drinkId)
            },
            mealId
          },
          create: drinksToAdd.map(({ id }) => ({
            drink: {
              connect: {
                id
              }
            }
          }))
        }
      }
    })
  ])
}

export async function getDrinks () {
  const drinks = await prisma.drink.findMany()
  return drinks
}

export async function getLabels () {
  const labels = await prisma.label.findMany()
  return labels
}
