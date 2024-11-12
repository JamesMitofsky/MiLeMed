import { Onboarding, OnboardingStepInfo, StepContent } from '@my/ui'
import { ArrowUp, Rocket, Sparkles } from '@tamagui/lucide-icons'
import { useRouter } from 'solito/router'

const steps: OnboardingStepInfo[] = [
  {
    theme: 'orange',
    Content: () => (
      <StepContent
        title="Lernen"
        icon={Sparkles}
        description="Entdecke prägnante Vorlesungen in der Geburtshilfe für effizientes Lernen."
      />
    ),
  },
  {
    theme: 'green',
    Content: () => (
      <StepContent
        title="Eintauchen"
        icon={ArrowUp}
        description="Tauche ein in maßgeschneiderte, kompakte Module nur für dich."
      />
    ),
  },
  {
    theme: 'blue',
    Content: () => (
      <StepContent
        title="Wachstum"
        icon={Rocket}
        description="Wachse in deiner medizinischen Ausbildung durch gezielte Mikrolektionen."
      />
    ),
  },
]

/**
 * note: this screen is used as a standalone page on native and as a sidebar on auth layout on web
 */
export const OnboardingScreen = () => {
  const router = useRouter()
  return <Onboarding autoSwipe onOnboarded={() => router.push('/sign-up')} steps={steps} />
}
