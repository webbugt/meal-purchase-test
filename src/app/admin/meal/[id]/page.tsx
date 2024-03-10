'use server'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { getDrinks, getLabels, getMeal, updateMeal } from '@/app/actions'
import { nullToUndefined } from '@/helpers/nullToUndefined'
import { MealForm, MealFormValues } from '@/components/forms/meal-form'
const Loading = () => 'Loading'
export async function MealEdit ({ id }: { id: string; }) {
  const handleSubmit = async (values: MealFormValues) => {
    'use server'
    await updateMeal(parseInt(id), values)
  }

  const [meal, drinkOptions, labelOptions] = await Promise.all([
    getMeal(parseInt(id)).then(nullToUndefined).then(meal => (!!meal && {
      ...meal,
      starter: meal.starter || '',
      labels: meal.labels.map(label => label.id),
      drinks: meal.drinks.map(drink => drink.id)
    }) || undefined),
    getDrinks()
      .then(drinks => drinks.map(drink => ({
        value: drink.id.toString(),
        label: `${drink.title} - ${drink.price}€`
      }))),
    getLabels()
      .then(labels => labels.map(label => ({
        value: label.id.toString(),
        label: label.title
      })))
  ])
  if (!meal) redirect('404')
  return <MealForm drinkOptions={drinkOptions} labelOptions={labelOptions} initialValues={meal} onSubmit={handleSubmit} />
}

export default async function NewMeal ({ params: { id } }:{params: {id: string | undefined}}) {
  if (!id) redirect('/admin/meal/new')
  // @NOTE: might be worth discussing if all 3 requests should be done together or after meal is found

  return <Suspense key={id} fallback={<Loading/>}>
    <MealEdit id={id}/>
  </Suspense>
}
