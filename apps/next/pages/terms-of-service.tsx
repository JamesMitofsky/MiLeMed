import { LegalLayout } from 'app/features/legal/layout.web'
import Head from 'next/head'

import { NextPageWithLayout } from './_app'
import { PrivacyPolicyScreen } from 'app/features/legal/privacy-policy-screen'

export const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Terms of Service</title>
      </Head>
      <PrivacyPolicyScreen />
    </>
  )
}

Page.getLayout = (page) => <LegalLayout>{page}</LegalLayout>

export default Page
