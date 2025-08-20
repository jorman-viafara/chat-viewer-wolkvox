"use client"

import { useState, useCallback } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, AlertCircle, MousePointer } from "lucide-react"
import { format, isSameMonth, isValid } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

interface DateRangePickerProps {
  dateRange: {
    from: Date | undefined
    to: Date | undefined
  }
  onDateRangeChange: (range: { from: Date | undefined; to: Date | undefined }) => void
}

export function DateRangePicker({ dateRange, onDateRangeChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSelecting, setIsSelecting] = useState(false)

  const safeFormat = (date: Date | undefined, formatStr: string) => {
    if (!date || !isValid(date)) return ""
    try {
      return format(date, formatStr, { locale: es })
    } catch (error) {
      console.error("[v0] Date formatting error:", error)
      return ""
    }
  }

  const handleDateSelect = useCallback(
    (range: { from: Date | undefined; to: Date | undefined } | undefined) => {
      if (!range) return

      const { from, to } = range

      if (from && to && !isSameMonth(from, to)) {
        toast({
          title: "Error de validación",
          description: "Solo se pueden seleccionar fechas del mismo mes",
          variant: "destructive",
        })
        return
      }

      if (from && to) {
        const finalFrom = new Date(from)
        finalFrom.setHours(0, 0, 0, 0)

        const finalTo = new Date(to)
        finalTo.setHours(23, 59, 59, 999)

        onDateRangeChange({ from: finalFrom, to: finalTo })
        setIsOpen(false)
      } else if (from) {
        const finalFrom = new Date(from)
        finalFrom.setHours(0, 0, 0, 0)
        onDateRangeChange({ from: finalFrom, to: undefined })
      }
    },
    [onDateRangeChange],
  )

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setIsSelecting(false)
    }
  }, [])

  return (
    <div className="space-y-2">
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal transition-all duration-300",
              "bg-slate-700/50 border border-blue-600/50 text-white hover:bg-blue-700/40 hover:border-blue-300",
              "backdrop-blur-sm shadow-lg shadow-blue-900/20",
              !dateRange.from && "text-blue-100/80",
              "glass-effect hover:shadow-xl hover:shadow-blue-500/30",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-blue-400" />
            {dateRange.from ? (
              dateRange.to ? (
                <span className="text-white font-medium">
                  {safeFormat(dateRange.from, "dd/MM/yyyy")} - {safeFormat(dateRange.to, "dd/MM/yyyy")}
                </span>
              ) : (
                <span className="text-white font-medium">{safeFormat(dateRange.from, "dd/MM/yyyy")}</span>
              )
            ) : (
              <span className="text-blue-100/80">Selecciona un rango de fechas</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 shadow-2xl border-0 bg-slate-700/50 glass-card animate-fade-in"
          align="start"
          style={{ zIndex: 10000 }}
        >
          <div className="p-4 border-b border-blue-600/50 bg-gradient-to-r from-blue-600/10 to-cyan-600/10">
            <div className="flex items-center gap-2 text-sm text-blue-200">
              <MousePointer className="h-4 w-4 text-blue-400" />
              <span>Selecciona fecha inicial y final</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-blue-100/80 mt-1">
              <AlertCircle className="h-3 w-3" />
              Solo fechas del mismo mes
            </div>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange.from}
            selected={dateRange}
            onSelect={handleDateSelect}
            numberOfMonths={2}
            locale={es}
            className="rounded-lg bg-slate-700/50 backdrop-blur-sm"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
