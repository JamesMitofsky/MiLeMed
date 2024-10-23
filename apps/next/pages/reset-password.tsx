import { AuthLayout } from 'app/features/auth/layout.web'
import { ChangePasswordScreen } from 'app/features/settings/change-password-screen'
import Head from 'next/head'
import type { NextPageWithLayout } from 'pages/_app'

const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Change Password</title>
      </Head>
      <ChangePasswordScreen />
    </>
  )
}

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>

export default Page
