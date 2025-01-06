'use client'

import { faker } from '@faker-js/faker'
import { SizableText, XStack, YStack } from '@my/ui'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  ChartData,
} from 'chart.js'
import { motion } from 'framer-motion'
import React from 'react'
import { Line, Bar } from 'react-chartjs-2'

const MotionYStack = motion(YStack)

// Chart.js-Komponenten registrieren
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

// Fake-Daten generieren
const generateFakeData = () => {
  const today = new Date()
  const daysInMonth = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (30 - i))
    return new Intl.DateTimeFormat('de-DE', {
      day: 'numeric',
      month: 'short',
      year: '2-digit',
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
  const dailyActiveUsers = daysInMonth.map(() => faker.number.int({ min: 200, max: 800 }))
  const quizAttempts = daysInMonth.map(() => faker.number.int({ min: 100, max: 500 }))
  const lectureCompletionRates = daysInMonth.map(() => faker.number.float({ min: 50, max: 100 }))
  const chapterProgress = Array.from({ length: 10 }, () => faker.number.float({ min: 1, max: 100 }))
  const weeklyActiveUsers = Array.from({ length: 4 }, (_, i) =>
    faker.number.int({ min: 800, max: 2000 })
  )

  return {
    daysInMonth,
    userRegistrations,
    quizCompletions,
    avgQuizTimes,
    appUsage,
    dailyActiveUsers,
    quizAttempts,
    lectureCompletionRates,
    chapterProgress,
    weeklyActiveUsers,
  }
}

const {
  daysInMonth,
  userRegistrations,
  quizCompletions,
  avgQuizTimes,
  appUsage,
  dailyActiveUsers,
  quizAttempts,
  lectureCompletionRates,
  chapterProgress,
  weeklyActiveUsers,
} = generateFakeData()

// Chart.js-Optionen
const options = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
}

// Datentypen definieren
type LineChartData = ChartData<'line', number[], string>
type BarChartData = ChartData<'bar', number[], string>

const DemoChartsDashboard: React.FC = () => {
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
        label: 'Abgeschlossene Quizze',
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

  const barData1: BarChartData = {
    labels: ['0-5', '5-10', '10-20', '20-30', '40+'],
    datasets: [
      {
        label: 'App-Nutzungsverteilung',
        data: appUsage,
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  }

  const barData2: BarChartData = {
    labels: daysInMonth,
    datasets: [
      {
        label: 'Tägliche aktive Benutzer',
        data: dailyActiveUsers,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  }

  const lineData4: LineChartData = {
    labels: daysInMonth,
    datasets: [
      {
        label: 'Quizversuche',
        data: quizAttempts,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  }

  const lineData5: LineChartData = {
    labels: daysInMonth,
    datasets: [
      {
        label: 'Vorlesungsabschlussrate (%)',
        data: lectureCompletionRates,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
      },
    ],
  }

  const barData3: BarChartData = {
    labels: Array.from({ length: 10 }, (_, i) => `Kapitel ${i + 1}`),
    datasets: [
      {
        label: 'Kapitel-Fortschritt (%)',
        data: chapterProgress,
        backgroundColor: 'rgba(255, 206, 86, 0.5)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
    ],
  }

  const barData4: BarChartData = {
    labels: ['Woche 1', 'Woche 2', 'Woche 3', 'Woche 4'],
    datasets: [
      {
        label: 'Wöchentliche aktive Benutzer',
        data: weeklyActiveUsers,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.2 },
    }),
  }

  return (
    <XStack flexWrap="wrap" gap="$8" jc="center">
      {[
        lineData1,
        lineData2,
        lineData3,
        barData1,
        barData3,
        barData2,
        lineData4,
        lineData5,
        barData4,
      ].map((data, index) => (
        <MotionYStack
          key={index}
          custom={index}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          width="45%"
          minWidth="$20"
          maxWidth={500}
          // @ts-ignore
          bg={`$${
            [
              'blue3Light',
              'green2Light',
              'orange2Light',
              'purple3Light',
              'yellow3Light',
              'green2Light',
              'red2Light',
              'blue2Light',
              'green2Light',
            ][index]
          }`}
          p="$4"
          borderRadius="$5"
        >
          <SizableText size="$6" mb="$4">
            {
              [
                'Benutzerregistrierungen',
                'Abgeschlossene Quizze',
                'Durchschnittliche Quizzeit',
                'App-Nutzungsverteilung',
                'Kapitel-Fortschritt',
                'Tägliche aktive Benutzer',
                'Quizversuche',
                'Vorlesungsabschlussrate',
                'Wöchentliche aktive Benutzer',
              ][index]
            }
          </SizableText>
          {index < 3 || index === 5 || index === 6 ? (
            <Line options={options} data={data as LineChartData} />
          ) : (
            <Bar options={options} data={data as BarChartData} />
          )}
        </MotionYStack>
      ))}
    </XStack>
  )
}

export { DemoChartsDashboard }
