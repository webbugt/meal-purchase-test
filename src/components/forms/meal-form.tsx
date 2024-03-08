'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ComboBoxSelect } from '../ui/combobox-select'
import { Badge } from '../ui/badge'

const createOptionalStringSchema = (minLength: number = 5, message = `Min length is ${minLength}`) => z
  .union([z.string().length(0), z.string().min(minLength, {
    message
  })])
  .optional()
  .transform(e => e === '' ? undefined : e)

const formSchema = z.object({
  title: z.string().min(5, {
    message: 'Title must be at least 5 characters.'
  }),
  starter: z.string().min(5, {
    message: 'Starter must be at least 5 characters.'
  }),
  desert: createOptionalStringSchema(5, 'Desert name must be at least 5 characters.'),
  description: createOptionalStringSchema(15, 'Description must be at least 15 characters.'),
  img: z.string().optional(),
  price: z.coerce.number().positive(),
  labels: z.array(z.number()).optional(),
  drinks: z.array(z.coerce.number()).optional()
})

export type MealFormValues = z.infer<typeof formSchema>

const defaultValues = {
  title: '',
  starter: '',
  desert: '',
  // description: '',
  // img: '',
  price: 12,
  labels: [],
  drinks: []
}

type MealFormProps = {
  values?:MealFormValues,
  onSubmit?: (values: MealFormValues) => void,
  drinkOptions: { value: string, label: string }[],
  labelOptions: { value: string, label: string }[],
}

export function MealForm ({ values, onSubmit: onSubmitInput, drinkOptions, labelOptions }:MealFormProps) {
  const form = useForm<MealFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    values
  })
  function onSubmit (values: MealFormValues) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    // @TODO: create more complex form for selecting labels and drinks
    values.labels = [37, 38, 39, 40]
    // values.drinks = [16, 17, 18]
    console.log(values)
    if (typeof onSubmitInput === 'function') onSubmitInput(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Some meal name" {...field} />
              </FormControl>
              <FormDescription>
                This is the meal title
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="starter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Starter</FormLabel>
              <FormControl>
                <Input placeholder="Dish name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="desert"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Desert</FormLabel>
              <FormControl>
                <Input placeholder="Dish name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" placeholder="15.99" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="drinks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Drinks available</FormLabel>
              <FormControl>
                <ComboBoxSelect single={false} value={field.value?.map(x => x.toString())} onChange={field.onChange} options={drinkOptions} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="labels"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meal labels</FormLabel>
              <FormControl>
                <ComboBoxSelect
                  single={false}
                  value={field.value?.map(x => x.toString())}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  options={labelOptions}
                  selectedRender={({ value, label }) => <Badge>{label}</Badge>}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
