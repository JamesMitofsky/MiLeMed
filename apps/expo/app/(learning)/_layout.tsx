import CustomHeader from '@my/app/features/general/CustomHeader'
import { Slot, useRouter } from 'expo-router'

const Layout = () => {
  const router = useRouter()

  return (
    <>
      <CustomHeader onBack={() => router.back()} />
      <Slot />
    </>
  )
}

export default Layout
