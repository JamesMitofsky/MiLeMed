import { AnimatePresence, Card, FullscreenSpinner, Label, Text, XStack, YStack } from '@my/ui'
import { GraduationCap, Mail, User } from '@tamagui/lucide-icons'
import { useUser } from 'app/utils/useUser'

export const EditProfileScreen = () => {
  const { profile, user } = useUser()

  if (!profile) {
    return <FullscreenSpinner />
  }

  return (
    <YStack padding="$4" gap="$4">
      <Card elevate bordered>
        <Card.Header padded>
          <XStack gap="$5" alignItems="center">
            <User size={40} color="$color" />
            <YStack>
              <Label size="$1">Name</Label>
              <Text fontSize="$7">{profile.name ?? 'Name nicht angegeben'}</Text>
            </YStack>
          </XStack>
        </Card.Header>
      </Card>

      <AnimatePresence>
        {profile.role === 'STUDENT' && (
          <YStack gap="$4" enterStyle={{ opacity: 0, y: 10 }} animation="quick">
            <Card elevate bordered>
              <Card.Header padded>
                <XStack gap="$5" alignItems="flex-start">
                  <GraduationCap size={40} color="$color" />
                  <YStack gap="$5">
                    <YStack>
                      <Label size="$1">Fachsemester</Label>
                      <Text fontSize="$7">
                        {profile.overall_semester ? profile.overall_semester : 'Nicht angegeben'}
                      </Text>
                    </YStack>
                    <YStack>
                      <Label size="$1">Klinisches Semester</Label>
                      <Text fontSize="$7">
                        {profile.clinical_semester ? profile.clinical_semester : 'Nicht angegeben'}
                      </Text>
                    </YStack>
                  </YStack>
                </XStack>
              </Card.Header>
            </Card>

            <Card elevate bordered>
              <Card.Header padded>
                <XStack gap="$5" alignItems="center">
                  <Mail size={40} color="$color" />
                  <YStack>
                    <Label size="$1">E Mail</Label>
                    <Text fontSize="$7">{user?.email ? user.email : 'Nicht angegeben'}</Text>
                  </YStack>
                </XStack>
              </Card.Header>
            </Card>
          </YStack>
        )}
      </AnimatePresence>
    </YStack>
  )
}
