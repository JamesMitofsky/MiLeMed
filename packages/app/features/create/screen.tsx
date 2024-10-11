import { TabbarSwippable } from '@my/ui/src/components/SwippableTabBar'

import { CreatePostForm } from './CreatePostForm'
import { CreateProjectForm } from './CreateProjectForm'

export const CreateScreen = () => {
  return <TabbarSwippable CreateProjectForm={CreateProjectForm} CreatePostForm={CreatePostForm} />
}
