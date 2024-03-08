'use client'
import { Noop } from 'react-hook-form'
// import { getDrinks } from '@/app/actions'
import React, { useState, useEffect, useCallback } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

type ComboBoxOption = { value: string, label: string }

type ComboBoxSelectPropsCommon ={
  onChange: (...event: any[]) => void;
  onBlur?: Noop;
  disabled?: boolean;
  name?: string;
  options: ComboBoxOption[]
}

type ComboBoxSelectProps = {
    value?: string;
    single: true
  } & ComboBoxSelectPropsCommon
| {
  value?: string[];
  single: false
} & ComboBoxSelectPropsCommon
const VALUE_SEPARATOR = '%%|%%'
type EncodedValue = `${string}${typeof VALUE_SEPARATOR}${string}`
const encodeOption = (option: ComboBoxOption):EncodedValue => `${option.value}${VALUE_SEPARATOR}${option.label}`
const decodeOption = (encoded:EncodedValue|string):ComboBoxOption => {
  const [value, label] = encoded.split(VALUE_SEPARATOR)
  return { label, value }
}

export const ComboBoxSelect = ({ value, options, onChange, single }:ComboBoxSelectProps) => {
  const [open, setOpen] = useState(false)
  const [internalValue, setInternalValue] = useState<string[]>(typeof value === 'string' ? [value] : (value || []))
  useEffect(() => {
    console.log('combobox new value', value)
    if (typeof value === 'string') {
      setInternalValue([value])
    } else {
      setInternalValue(value || [])
    }
  }, [value])

  const onSelect = useCallback((currentValueJoined:EncodedValue|string) => {
    const { value: currentValue } = decodeOption(currentValueJoined)
    console.log({ currentValue })
    setOpen(false)
    if (single) {
      onChange(currentValue === internalValue[0] ? '' : currentValue)
      // setInternalValue(currentValue === value ? [] : [currentValue])
      return
    }

    if (internalValue.indexOf(currentValue) === -1) {
      console.log('combobox onSelect add', currentValue, internalValue)
      // setInternalValue([...internalValue, currentValue])
      onChange([...internalValue, currentValue])
      return
    }
    console.log('combobox onSelect remove', currentValue, internalValue)
    onChange(internalValue.filter((val) => val !== currentValue))
    // setInternalValue()
  }, [internalValue, onChange, single])
  console.log('combobox', { value, internalValue, open, options })

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
          <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="min-w-[200px] max-w-[400px] flex-wrap h-auto justify-start"
        >
          <ChevronsUpDown className="ml-0 mr-2 h-4 w-4 shrink-0 opacity-50" />
          {(internalValue.length ? internalValue : ['']).map((val, index, arr) => (
            <React.Fragment key={val}>
              <span>
                {options.find((option) => option.value === val)?.label || 'Select an option...'}
              </span>
            {(index < (arr.length - 1)) && <Separator orientation="vertical" className="mx-3 h-4" />}
            </React.Fragment>
          ))}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search option..." />
          <CommandEmpty>No option found.</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={encodeOption(option)} // search works based on value, that's why we encode it like this
                onSelect={onSelect}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    internalValue.includes(option.value) ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
