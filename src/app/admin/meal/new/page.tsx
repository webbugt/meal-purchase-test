'use server'
import { createMeal, getDrinks, getLabels } from '@/app/actions'
import { MealForm } from '@/components/forms/meal-form'

export default async function NewMeal () {
  const [drinkOptions, labelOptions] = await Promise.all([
    getDrinks().then(drinks => drinks.map(drink => ({ value: drink.id.toString(), label: `${drink.title} - ${drink.price}€` }))),
    getLabels().then(labels => labels.map(label => ({ value: label.id.toString(), label: label.title })))
  ])

  return <MealForm onSubmit={createMeal} drinkOptions={drinkOptions} labelOptions={labelOptions}/>
}
