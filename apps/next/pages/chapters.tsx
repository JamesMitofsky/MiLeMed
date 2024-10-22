import { LegalLayout } from 'app/features/legal/layout.web'
import Head from 'next/head'

import { NextPageWithLayout } from './_app'
import ViewChaptersScreen from '../../../packages/app/features/chapters/ViewChaptersScreen'

export const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Kapitel</title>
      </Head>
      <ViewChaptersScreen />
    </>
  )
}

Page.getLayout = (page) => <LegalLayout>{page}</LegalLayout>

export default Page
