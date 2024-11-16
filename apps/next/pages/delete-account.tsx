import { DeleteScreen } from 'app/features/help/delete-screen'
import { LegalLayout } from 'app/features/legal/layout.web'
import Head from 'next/head'

import { NextPageWithLayout } from './_app'

export const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Konto löschen</title>
      </Head>
      <DeleteScreen />
    </>
  )
}

Page.getLayout = (page) => <LegalLayout>{page}</LegalLayout>

export default Page
