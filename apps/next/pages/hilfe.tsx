import { HelpScreen } from 'app/features/help/help-screen'
import { LegalLayout } from 'app/features/legal/layout.web'
import Head from 'next/head'

import { NextPageWithLayout } from './_app'

export const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Hilfe</title>
      </Head>
      <HelpScreen />
    </>
  )
}

Page.getLayout = (page) => <LegalLayout>{page}</LegalLayout>

export default Page
