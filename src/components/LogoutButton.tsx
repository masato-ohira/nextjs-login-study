import { useMtAuth } from '@/recoil/auth'
import { Button } from '@chakra-ui/react'
import { useState } from 'react'
import { MdLogout } from 'react-icons/md'

export const LogoutButton = () => {
  const [loading, setLoading] = useState(false)
  const { logoutWithApi } = useMtAuth()

  const logoutFunc = async () => {
    setLoading(true)
    await logoutWithApi()
    setLoading(false)
  }
  return (
    <Button
      size={'sm'}
      isLoading={loading}
      iconSpacing={1}
      onClick={logoutFunc}
      leftIcon={<MdLogout size={20} />}
    >
      ログアウト
    </Button>
  )
}
