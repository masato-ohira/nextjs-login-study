import { useMtAuth } from '@/recoil/auth'
import { Box } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import { Loading } from './Loading'
import { Header } from './Header'

export const Authorized = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const { isAuthed, refreshToken } = useMtAuth()

  useEffect(() => {
    const init = async () => {
      if (isAuthed()) {
        await refreshToken()
        setReady(true)
      } else {
        router.push('/')
      }
    }
    init()
  }, [router.pathname])

  if (!ready) return <Loading />
  if (isAuthed())
    return (
      <>
        <Header />
        <Box>{children}</Box>
      </>
    )
  return <></>
}
