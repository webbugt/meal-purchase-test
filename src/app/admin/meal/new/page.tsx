'use server'
import { createMeal } from '@/app/actions'
import { MealForm } from '@/components/forms/meal-form'

export default async function NewMeal () {
  return <MealForm onSubmit={createMeal}/>
}
