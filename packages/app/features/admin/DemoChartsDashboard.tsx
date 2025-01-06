'use client'

import { faker } from '@faker-js/faker'
import { SizableText, XStack, YStack } from '@my/ui'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  ChartData,
} from 'chart.js'
import React from 'react'
import { Line, Bar } from 'react-chartjs-2'

// 2. Register Chart.js Components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

// 3. Generate Fake Data
const generateFakeData = (): {
  daysInMonth: string[]
  userRegistrations: number[]
  quizCompletions: number[]
  avgQuizTimes: number[]
  appUsage: number[]
} => {
  const today = new Date()
  const daysInMonth = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (30 - i))

    // Format the date in German with words
    return new Intl.DateTimeFormat('de-DE', {
      day: 'numeric', // Day of the month
      month: 'short', // Full month name
      year: '2-digit', // Full year
    }).format(date)
  })

  const userRegistrations = daysInMonth.map((_, i) =>
    Math.floor((i + 1) * faker.number.float({ min: 0.5, max: 1.5 }))
  )

  const quizCompletions = daysInMonth.map((_, i) =>
    Math.floor((i + 1) * faker.number.float({ min: 0.7, max: 2 }))
  )

  const avgQuizTimes = daysInMonth.map((_, i) =>
    Math.floor(
      30 + i * faker.number.float({ min: 1, max: 5 }) + faker.number.float({ min: -10, max: 10 })
    )
  )

  const appUsage = Array.from({ length: 6 }, (_, i) =>
    Math.floor(
      (i + 1) * faker.number.float({ min: 1, max: 5 }) + faker.number.float({ min: 5, max: 15 })
    )
  )

  return { daysInMonth, userRegistrations, quizCompletions, avgQuizTimes, appUsage }
}

const { daysInMonth, userRegistrations, quizCompletions, avgQuizTimes, appUsage } =
  generateFakeData()

// 4. Chart.js options
const options: ChartOptions<'line' | 'bar'> = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
}

// Define data types
type LineChartData = ChartData<'line', number[], string>
type BarChartData = ChartData<'bar', number[], string>

const DemoChartsDashboard: React.FC = () => {
  // 5. Define chart data
  const lineData1: LineChartData = {
    labels: daysInMonth,
    datasets: [
      {
        label: 'Benutzerregistrierungen',
        data: userRegistrations,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
      },
    ],
  }

  const lineData2: LineChartData = {
    labels: daysInMonth,
    datasets: [
      {
        label: 'Quiz-Abschlüsse',
        data: quizCompletions,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  }

  const lineData3: LineChartData = {
    labels: daysInMonth,
    datasets: [
      {
        label: 'Durchschnittliche Quizzeit (s)',
        data: avgQuizTimes,
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
      },
    ],
  }

  const barData: BarChartData = {
    labels: ['0-10', '10-20', '20-30', '30-40', '40-50', '50-60'],
    datasets: [
      {
        label: 'Nutzeranzahl',
        data: appUsage,
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  }

  // 6. Render UI
  return (
    <YStack
      gap="$4"
      // bg="$accentBackground"
      borderRadius="$5"
      justifyContent="center"
      alignItems="center"
      padding="$4"
    >
      {/* A single XStack that wraps */}
      <XStack flexWrap="wrap" gap="$8" justifyContent="center">
        {/* Item 1 */}
        <YStack flexBasis="45%" minWidth="$20" bg="$blue3Light" p="$4" borderRadius="$5">
          <SizableText size="$7" mb="$4">
            Benutzerregistrierung
          </SizableText>
          <Line options={options} data={lineData1} />
        </YStack>

        {/* Item 2 */}
        <YStack flexBasis="45%" minWidth="$20" bg="$green2Light" p="$4" borderRadius="$5">
          <SizableText size="$8" mb="$4">
            Quiz-Abschlüsse
          </SizableText>
          <Line options={options} data={lineData2} />
        </YStack>

        {/* Item 3 */}
        <YStack flexBasis="45%" minWidth="$20" bg="$orange2Light" p="$4" borderRadius="$5">
          <SizableText size="$8" mb="$4">
            Durchschnittliche Quizzeit
          </SizableText>
          <Line options={options} data={lineData3} />
        </YStack>

        {/* Item 4 */}
        <YStack flexBasis="45%" minWidth="$20" bg="$purple3Light" p="$4" borderRadius="$5">
          <SizableText size="$8" mb="$4">
            App-Nutzungsverteilung
          </SizableText>
          <Bar options={options} data={barData} />
        </YStack>
      </XStack>
    </YStack>
  )
}

export { DemoChartsDashboard }
