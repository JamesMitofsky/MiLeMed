import { LegalLayout } from 'app/features/legal/layout.web'
import dynamic from 'next/dynamic'
import Head from 'next/head'

import { NextPageWithLayout } from './_app'

const ViewChaptersScreen = dynamic(
  () =>
    import('../../../packages/app/features/chapters/ViewChaptersScreen').then(
      (mod) => mod.ViewChaptersScreen
    ),
  { ssr: false }
)

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
