import CustomHeader from '@my/app/features/general/CustomHeader'
import { Slot } from 'expo-router'

const Layout = () => (
  <>
    <CustomHeader />
    <Slot />
  </>
)

export default Layout
