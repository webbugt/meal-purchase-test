import { PrismaClient } from "@prisma/client";
import { labelsData, drinksData, mealsData } from "./seed_data";

type Truthy<T> = T extends false | "" | 0 | null | undefined ? never : T; // from lodash

function truthy<T>(value: T): value is Truthy<T> {
  return !!value;
}

const prisma = new PrismaClient();
async function main() {
  await prisma.label.createMany({
    data: labelsData.map((label) => ({
      title: label,
    })),
  });
  const labelEntities = await prisma.label.findMany();

  await prisma.drink.createMany({
    data: drinksData.map((drink) => ({
      title: drink.title,
      price: drink.price,
    })),
  });
  const drinkEntities = await prisma.drink.findMany();

  await Promise.all(
    mealsData.map((meal) => {
      const labels = meal.labels
        .map((label) => labelEntities.find((entity) => entity.title === label))
        .filter(truthy);

      const drinks = meal.drinks
        .map((drink) => drinkEntities.find((entity) => entity.title === drink))
        .filter(truthy);

      return prisma.meal.create({
        data: {
          title: meal.title,
          starter: meal.starter,
          desert: meal.desert,
          price: meal.price,
          img: meal.img,
          labels: {
            create: meal.labels?.map((title) => ({
              label: {
                connect: {
                  id: labels.find((t) => t.title === title)?.id,
                },
              },
            })),
          },

          drinks: {
            create: meal.drinks?.map((title) => ({
              drink: {
                connect: {
                  id: drinks.find((t) => t.title === title)?.id,
                },
              },
            })),
          },
        },
      });
    })
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
