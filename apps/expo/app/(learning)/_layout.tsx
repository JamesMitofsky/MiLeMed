import { Slot } from 'expo-router'

const Layout = () => {
  return (
    <>
      {/* <CustomHeader onBack={() => router.back()} /> */}
      <Slot />
    </>
  )
}

export default Layout
