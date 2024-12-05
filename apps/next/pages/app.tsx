import { motion } from 'framer-motion'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import NextImage from 'next/image'
import { useEffect, useState } from 'react'
import { YStack, Text, useMedia, XStack } from 'tamagui'
const DynamicVideo = dynamic(() => Promise.resolve(VideoComponent), { ssr: false })

const MotionYStack = motion(YStack)
const MotionXStack = motion(XStack)
const MotionText = motion(Text)
const MotionImage = motion(NextImage)

const AppAnnouncement: NextPage = () => {
  const { sm } = useMedia()

  // Define a sequential animation for child elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.1,
        staggerChildren: 0.4, // Delay between animations of child elements
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.5 } },
  }

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  }

  return (
    <MotionYStack
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      flex={1}
      justifyContent="center"
      alignItems="center"
      padding="$4"
      gap="$6"
    >
      <MotionImage
        initial="hidden"
        animate="visible"
        variants={logoVariants}
        src="/logo.png"
        alt="Logo"
        width={0}
        height={0}
        sizes="100vw"
        style={{
          width: '100%',
          maxWidth: '5rem',
          height: 'auto',
          position: 'absolute',
          top: 18,
          left: 18,
        }}
      />

      <motion.div variants={itemVariants}>
        <DynamicVideo sm={sm} />
      </motion.div>

      <MotionText variants={itemVariants} fontSize="$6" textAlign="center">
        Ändere deine Lernweise. Kleine Lektionen für große Ergebnisse.
      </MotionText>

      {sm ? (
        <MotionYStack variants={itemVariants} gap="$5" alignItems="center">
          <DownloadButtons sm={sm} />
        </MotionYStack>
      ) : (
        <MotionXStack variants={itemVariants} gap="$6" alignItems="center">
          <DownloadButtons sm={sm} />
        </MotionXStack>
      )}
    </MotionYStack>
  )
}

export default AppAnnouncement

const DownloadButtons = ({ sm }: { sm: boolean }) => {
  const [os, setOs] = useState<'ios' | 'android' | 'unknown'>()

  useEffect(() => {
    // Ensure we run this only in the browser
    if (typeof navigator !== 'undefined') {
      const userAgent = navigator.userAgent.toLowerCase()

      if (userAgent.includes('android')) {
        setOs('android')
      } else if (/iphone|ipad|ipod/.test(userAgent)) {
        setOs('ios')
      } else {
        setOs('unknown')
      }
    }
  }, [])

  return (
    <>
      {(os === 'ios' || os === 'unknown') && (
        <a href="https://apps.apple.com/app/id6737435431" target="_blank" rel="noopener noreferrer">
          <NextImage
            src="/download-on-app-store.svg"
            alt="Apple App Store"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: '20%', minWidth: sm ? '12rem' : '11rem', height: 'auto' }}
          />
        </a>
      )}

      {(os === 'android' || os === 'unknown') && (
        <a
          style={{
            width: 'min-content',
          }}
          href="/android"
          target="_blank"
          rel="noopener noreferrer"
        >
          <NextImage
            src="/download-on-google-play.webp"
            alt="Google Play Store"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: '20%', minWidth: '12rem', height: 'auto' }}
          />
        </a>
      )}
    </>
  )
}
