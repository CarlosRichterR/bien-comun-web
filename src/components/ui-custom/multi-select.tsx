"use client"

import * as React from "react"
import { Check, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export type Option = {
    label: string
    value: string
}

interface MultiSelectProps {
    options: Option[]
    selectedValues: string[]
    onSelectionChange: (values: string[]) => void
    placeholder?: string
    id?: string
    className?: string
}

export function MultiSelect({
    options,
    selectedValues,
    onSelectionChange,
    placeholder = "Seleccionar...",
    id,
    className,
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false)

    const handleSelect = (value: string) => {
        if (selectedValues.includes(value)) {
            onSelectionChange(selectedValues.filter((v) => v !== value))
        } else {
            onSelectionChange([...selectedValues, value])
        }
    }

    const handleRemove = (value: string) => {
        onSelectionChange(selectedValues.filter((v) => v !== value))
    }

    const handleClear = () => {
        // Si existe la opción "Todos", seleccionarla
        const allOption = options.find((opt) => opt.value === "Todos");
        if (allOption) {
            onSelectionChange([allOption.value]); // Selecciona "Todos"
        } else {
            onSelectionChange([]); // Limpia todos los filtros si "Todos" no está disponible
        }
    }

    const selectedLabels = selectedValues.map((value) => {
        const option = options.find((opt) => opt.value === value)
        return option ? option.label : value
    })

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <div className="relative w-full">
                <PopoverTrigger asChild>
                    <Button
                        id={id}
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn("w-full justify-between", className)}
                    >
                        {selectedValues.length > 0 ? (
                            <div className="flex flex-wrap gap-1 max-w-[90%] overflow-hidden">
                                {selectedValues.length <= 2 ? (
                                    selectedLabels.map((label) => (
                                        <Badge key={label} variant="secondary" className="mr-1">
                                            {label}
                                        </Badge>
                                    ))
                                ) : (
                                    <span>{selectedValues.length} seleccionados</span>
                                )}
                            </div>
                        ) : (
                            <span className="text-muted-foreground">{placeholder}</span>
                        )}
                    </Button>
                </PopoverTrigger>
                {selectedValues.length > 0 && (
                    <button
                        type="button"
                        tabIndex={-1}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer bg-transparent border-0 p-0"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClear();
                        }}
                        aria-label="Limpiar selección"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
            <PopoverContent className="w-full p-0" align="start">
                <Command>
                    <CommandInput placeholder="Buscar..." />
                    <CommandList>
                        <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-auto">
                            {options.map((option) => {
                                const isSelected = selectedValues.includes(option.value);
                                return (
                                    <CommandItem key={option.value} value={option.value} onSelect={() => handleSelect(option.value)}>
                                        <div
                                            className={cn(
                                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                isSelected ? "bg-primary text-primary-foreground" : "opacity-50"
                                            )}
                                        >
                                            {isSelected && <Check className="h-3 w-3" />}
                                        </div>
                                        <span>{option.label}</span>
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

