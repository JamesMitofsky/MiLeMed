import { Cake, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from '@tamagui/lucide-icons'
import React, { useMemo, useState } from 'react'
import { Button, Sheet, XStack, YStack, SizableText } from 'tamagui'

function getDaysInMonth(year: number, month: number): { day: number; date: Date }[] {
  const date = new Date(Date.UTC(year, month, 1))
  const days: { day: number; date: Date }[] = []
  while (date.getUTCMonth() === month) {
    days.push({ day: date.getUTCDate(), date: new Date(date) })
    date.setUTCDate(date.getUTCDate() + 1)
  }
  return days
}

export function MinimalDatePicker({
  value,
  onChange,
  placeholder,
}: {
  value: Date | undefined
  onChange: (date: Date | undefined) => void
  placeholder: string
}) {
  const selectedDate = value || undefined

  const defaultDate = new Date(Date.UTC(2000, new Date().getUTCMonth(), 1))
  const displayDate = selectedDate || defaultDate

  const [displayYear, setDisplayYear] = useState(displayDate.getUTCFullYear())
  const [displayMonth, setDisplayMonth] = useState(displayDate.getUTCMonth())
  const [open, setOpen] = useState(false)

  const days = useMemo(() => getDaysInMonth(displayYear, displayMonth), [displayYear, displayMonth])

  const handleSelectDay = (day: number) => {
    const d = new Date(Date.UTC(displayYear, displayMonth, day))
    onChange?.(d)
    setOpen(false) // Close the sheet when a date is selected
  }

  const monthNames = [
    'Jan.',
    'Feb.',
    'Mär.',
    'Apr.',
    'Mai',
    'Jun.',
    'Jul.',
    'Aug.',
    'Sep.',
    'Okt.',
    'Nov.',
    'Dez.',
  ]
  const weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

  return (
    <YStack>
      <Button onPress={() => setOpen(true)} jc="flex-start">
        <XStack jc="space-between" ai="center" width="100%">
          <SizableText textAlign="left">
            {selectedDate
              ? `${selectedDate.getUTCDate()}. ${
                  monthNames[selectedDate.getUTCMonth()]
                } ${selectedDate.getUTCFullYear()}`
              : placeholder}
          </SizableText>
          <Cake />
        </XStack>
      </Button>

      <Sheet open={open} onOpenChange={setOpen} modal dismissOnSnapToBottom>
        {/* Add Overlay */}
        <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />

        {/* Add Handle */}
        <Sheet.Handle />

        <Sheet.Frame padding="$4" justifyContent="flex-start" minHeight={400}>
          <YStack gap="$3" alignItems="center">
            {/* Navigation Row */}
            <XStack justifyContent="space-around" width="100%" alignItems="center" my="$6">
              {/* Year picker */}
              <XStack alignItems="center" gap="$2">
                <Button
                  size="$3"
                  onPress={() => setDisplayYear(displayYear - 1)}
                  icon={<ChevronsLeft />}
                />
                <SizableText size="$5" textAlign="center" minWidth={47}>
                  {displayYear}
                </SizableText>
                <Button
                  size="$3"
                  onPress={() => setDisplayYear(displayYear + 1)}
                  icon={<ChevronsRight />}
                />
              </XStack>

              {/* Month picker */}
              <XStack alignItems="center" gap="$2">
                <Button
                  size="$3"
                  onPress={() => {
                    const newMonth = displayMonth - 1
                    if (newMonth < 0) {
                      setDisplayYear(displayYear - 1)
                      setDisplayMonth(11)
                    } else {
                      setDisplayMonth(newMonth)
                    }
                  }}
                  icon={<ChevronLeft />}
                />
                <SizableText size="$5" textAlign="center" minWidth={40}>
                  {monthNames[displayMonth]}
                </SizableText>
                <Button
                  size="$3"
                  onPress={() => {
                    const newMonth = displayMonth + 1
                    if (newMonth > 11) {
                      setDisplayYear(displayYear + 1)
                      setDisplayMonth(0)
                    } else {
                      setDisplayMonth(newMonth)
                    }
                  }}
                  icon={<ChevronRight />}
                />
              </XStack>
            </XStack>

            {/* Weekdays */}
            <XStack justifyContent="space-between" width="100%">
              {weekDays.map((day) => (
                <SizableText key={day} size="$2" textAlign="center">
                  {day}
                </SizableText>
              ))}
            </XStack>

            {/* Days Grid */}
            <YStack gap="$2">
              {(() => {
                const firstDay = new Date(Date.UTC(displayYear, displayMonth, 1)).getUTCDay()
                const adjustedFirstDay = (firstDay + 6) % 7 // Adjust for Monday start
                const rows: JSX.Element[] = []
                let currentWeek: React.ReactNode[] = []

                // Add empty placeholders for days before the first of the month
                for (let i = 0; i < adjustedFirstDay; i++) {
                  currentWeek.push(
                    <XStack
                      key={`empty-${i}`}
                      flexBasis="14.2857%"
                      flexShrink={0}
                      aspectRatio={1}
                    />
                  )
                }

                // Add the days of the month
                days.forEach(({ day }) => {
                  currentWeek.push(
                    <Button
                      key={day}
                      flexBasis="14.2857%" // 1/7th of the row width
                      flexShrink={0}
                      aspectRatio={1} // Ensure square buttons
                      backgroundColor={
                        selectedDate &&
                        selectedDate.getUTCFullYear() === displayYear &&
                        selectedDate.getUTCMonth() === displayMonth &&
                        selectedDate.getUTCDate() === day
                          ? '$backgroundHover'
                          : 'transparent'
                      }
                      onPress={() => handleSelectDay(day)}
                    >
                      <SizableText size="$2" textAlign="center">
                        {day}
                      </SizableText>
                    </Button>
                  )

                  // Push the row when a week is complete
                  if (currentWeek.length === 7) {
                    rows.push(
                      <XStack
                        key={`week-${rows.length}`}
                        justifyContent="flex-start"
                        width="100%"
                        gap="$2" // Add gap for consistent spacing
                      >
                        {currentWeek}
                      </XStack>
                    )
                    currentWeek = []
                  }
                })

                // Fill remaining days in the last week
                while (currentWeek.length < 7) {
                  currentWeek.push(
                    <XStack
                      key={`empty-tail-${currentWeek.length}`}
                      flexBasis="14.2857%"
                      flexShrink={0}
                      aspectRatio={1}
                    />
                  )
                }
                rows.push(
                  <XStack
                    key="week-last"
                    justifyContent="flex-start"
                    width="100%"
                    gap="$2" // Add gap for consistent spacing
                  >
                    {currentWeek}
                  </XStack>
                )

                return rows
              })()}
            </YStack>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </YStack>
  )
}
