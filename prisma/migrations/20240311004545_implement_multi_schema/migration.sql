-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "base";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "user";

-- CreateTable
CREATE TABLE "base"."Label" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "img" TEXT,

    CONSTRAINT "Label_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "base"."LabelOnMeal" (
    "mealId" INTEGER NOT NULL,
    "labelId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LabelOnMeal_pkey" PRIMARY KEY ("mealId","labelId")
);

-- CreateTable
CREATE TABLE "base"."Meal" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "starter" VARCHAR(255),
    "desert" VARCHAR(255),
    "description" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "img" TEXT,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Meal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "base"."DrinkOnMeal" (
    "mealId" INTEGER NOT NULL,
    "drinkId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DrinkOnMeal_pkey" PRIMARY KEY ("mealId","drinkId")
);

-- CreateTable
CREATE TABLE "base"."Drink" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "img" TEXT,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Drink_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "base"."LabelOnMeal" ADD CONSTRAINT "LabelOnMeal_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "base"."Meal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base"."LabelOnMeal" ADD CONSTRAINT "LabelOnMeal_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "base"."Label"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base"."DrinkOnMeal" ADD CONSTRAINT "DrinkOnMeal_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "base"."Meal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base"."DrinkOnMeal" ADD CONSTRAINT "DrinkOnMeal_drinkId_fkey" FOREIGN KEY ("drinkId") REFERENCES "base"."Drink"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
