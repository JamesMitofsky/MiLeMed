import { HomeLayout } from 'app/features/home/layout.web'
import dynamic from 'next/dynamic'
import Head from 'next/head'

import type { NextPageWithLayout } from '../_app'

const SidebarDrawer = dynamic(
  () => import('app/features/profile/screen').then((mod) => mod.SidebarDrawer),
  { ssr: false }
)

const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <SidebarDrawer />
    </>
  )
}

Page.getLayout = (page) => <HomeLayout fullPage>{page}</HomeLayout>

export default Page
