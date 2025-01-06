import { H1, isWeb, ScrollView, YStack } from '@my/ui'
import { DemoChartsDashboard } from 'app/features/admin/DemoChartsDashboard'
import { HomeLayout } from 'app/features/home/layout.web'
import ScrollToTopTabBarContainer from 'app/utils/NativeScreenContainer'
import Head from 'next/head'

import { NextPageWithLayout } from './_app'

export const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>

      <ScrollView f={4} fb={0} mx="$5">
        <ScrollToTopTabBarContainer>
          <YStack gap="$7" pb="$10" pt="$5">
            {isWeb && <H1>Interaktive Daten-Dashboard</H1>}
            <DemoChartsDashboard />
          </YStack>
        </ScrollToTopTabBarContainer>
      </ScrollView>
    </>
  )
}

Page.getLayout = (page) => <HomeLayout>{page}</HomeLayout>

export default Page
