import { TabbarSwippable } from '@my/ui/src/components/SwippableTabBar'

import { CreateEventForm } from './CreateEventForm'
import { CreatePostForm } from './CreatePostForm'
import { CreateProjectForm } from './CreateProjectForm'

export const CreateScreen = () => {
  return (
    <TabbarSwippable
      CreateProjectForm={CreateProjectForm}
      CreatePostForm={CreatePostForm}
      CreateEventForm={CreateEventForm}
    />
  )
}
