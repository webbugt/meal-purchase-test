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

type ComboBoxSelectOption = { value: string, label: string }

const VALUE_SEPARATOR = '%%|%%'
type CBSelectEncodedValue = `${string}${typeof VALUE_SEPARATOR}${string}`
const encodeOption = (option: ComboBoxSelectOption):CBSelectEncodedValue => `${option.value}${VALUE_SEPARATOR}${option.label}`
const decodeOption = (encoded:CBSelectEncodedValue|string):ComboBoxSelectOption => {
  const [value, label] = encoded.split(VALUE_SEPARATOR)
  return { label, value }
}

type ComboBoxSelectPropsCommon ={
  onChange: (...event: any[]) => void;
  onBlur?: Noop;
  disabled?: boolean;
  name?: string;
  options: ComboBoxSelectOption[];
  selectedRender?: (option:ComboBoxSelectOption) => React.ReactNode | string;
  optionRender?: (option:ComboBoxSelectOption, isSelected: boolean) => React.ReactNode | string;
  hotkey?: string[];
}

const DEFAULT_HOTKEY = ['Shift']

type ComboBoxSelectProps = {
    value?: string;
    single: true
  } & ComboBoxSelectPropsCommon
| {
  value?: string[];
  single: false
} & ComboBoxSelectPropsCommon

export const ComboBoxSelect = ({ value, options, onChange, single, selectedRender, optionRender, hotkey = DEFAULT_HOTKEY, onBlur }:ComboBoxSelectProps) => {
  const [open, setOpen] = useState(false)
  const [inFocus, setInFocus] = useState(false)
  const handleFocusChange = useCallback((focus:boolean) => {
    setInFocus(focus)
    if (typeof onBlur === 'function' && !focus) onBlur()
  }, [onBlur])

  const [internalValue, setInternalValue] = useState<string[]>(typeof value === 'string' ? [value] : (value || []))
  useEffect(() => {
    if (typeof value === 'string') {
      setInternalValue([value])
      return
    }
    setInternalValue(Array.isArray(value) ? value : [])
  }, [value])

  const [keepOpenHotkeyDown, setKeepOpenHotkeyDown] = useState(false)
  useEffect(() => {
    console.log('keepOpenHotkeyDown', { keepOpenHotkeyDown, inFocus })
  }, [keepOpenHotkeyDown, inFocus])

  const handleOpenChange = useCallback((popoverOpen: boolean) => {
    setOpen(previous => {
      if (!previous) return true
      if (popoverOpen) return true
      if (keepOpenHotkeyDown) return true
      return false
    })
  }, [keepOpenHotkeyDown])

  const onSelect = useCallback((currentValueJoined:CBSelectEncodedValue|string) => {
    const { value: currentValue } = decodeOption(currentValueJoined)
    handleOpenChange(false)

    if (single) {
      onChange(currentValue === internalValue[0] ? '' : currentValue)
      return
    }

    if (internalValue.indexOf(currentValue) === -1) {
      onChange([...internalValue, currentValue])
      return
    }

    onChange(internalValue.filter((val) => val !== currentValue))
  }, [internalValue, onChange, single, handleOpenChange])

  React.useEffect(() => {
    const hotkeyMatchesEvent = (event:KeyboardEvent) => hotkey.some((key) => !!(event as any)[key] || event.code === key || event.key === key)
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return
      setKeepOpenHotkeyDown(previous => previous || hotkeyMatchesEvent(event))
    }
    const handleKeyUp = (event: KeyboardEvent) => {
      const hotkeyMatches = hotkeyMatchesEvent(event)
      if (hotkeyMatches) setKeepOpenHotkeyDown(false)
    }
    if (inFocus) document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    return () => {
      if (inFocus) document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [hotkey, inFocus])

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild onFocus={() => {
        console.log('onFocus')
        handleFocusChange(true)
      }}
      >
          <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="min-w-[200px] max-w-[400px] flex-wrap h-auto justify-start gap-2"
        >
          <ChevronsUpDown className="ml-0 mr-2 h-4 w-4 shrink-0 opacity-50" />
          {(internalValue.length ? internalValue : ['']).map((val, index, arr) => {
            const option = options.find((option) => option.value === val) || { value: '', label: 'Select an option...' }
            return (
              <React.Fragment key={val}>
                {typeof selectedRender === 'function' && option.value
                  ? selectedRender(option)
                  : <>
                  <span>
                    {option.label}
                  </span>
                  {(index < (arr.length - 1)) && <Separator orientation="vertical" className="mx-3 h-4" />}
                </>}
              </React.Fragment>
            )
          })}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start" onBlur={() => {
        console.log('onBlur')
        handleFocusChange(false)
      }}>
        <Command>
          <CommandInput placeholder="Search option..." />
          <CommandEmpty>No option found.</CommandEmpty>
          <CommandGroup>
            {options.map((option) => {
              const isSelected = internalValue.includes(option.value)

              return (<CommandItem
                  key={option.value}
                  value={encodeOption(option)} // search works based on value, that's why we encode it like this
                  onSelect={onSelect}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      isSelected ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {typeof optionRender === 'function' ? optionRender(option, isSelected) : option.label}
                </CommandItem>)
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
