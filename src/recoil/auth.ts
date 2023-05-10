import axios from 'axios'
import { useRouter } from 'next/router'
import { atom, useRecoilState } from 'recoil'
import { recoilPersist } from 'recoil-persist'
import dayjs from 'dayjs'

const apiPath = `/mt-admin/mt-data-api.cgi/v5`
const { persistAtom } = recoilPersist({
  key: 'login-demo-recoil',
  storage: typeof window === 'undefined' ? undefined : localStorage,
})

type TokenType = {
  accessToken: string
  expiresIn: number
  remember: boolean
  sessionId: string
  now: string
} | null

export const tokenAtom = atom<TokenType>({
  key: 'tokenAtom',
  default: null,
  effects_UNSTABLE: [persistAtom],
})

// hooks
// ------------------------------
export const useMtAuth = () => {
  const [auth, setToken] = useRecoilState(tokenAtom)
  const router = useRouter()
  const isAuthed = () => {
    if (auth) {
      return true
    } else {
      return false
    }
  }

  type LoginParams = {
    username: string
    password: string
  }
  const login = async (params: LoginParams) => {
    try {
      setToken(null)
      const apiParams = new URLSearchParams()
      apiParams.append('username', params.username)
      apiParams.append('password', params.password)
      apiParams.append('clientId', 'demo')

      let { data } = await axios.post(`${apiPath}/authentication/`, apiParams, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      setToken({
        ...data,
        now: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      })
      return true
    } catch (error) {
      console.error(error)
      throw new Error()
    }
  }

  const logoutWithApi = async () => {
    try {
      if (auth) {
        await axios.delete(`${apiPath}/authentication/`, {
          headers: {
            'X-MT-Authorization': `MTAuth sessionId=${auth?.sessionId}`,
          },
        })
      }
      setToken(null)
      router.push('/')
    } catch (error) {
      router.push('/')
    }
  }

  const logout = () => {
    setToken(null)
    router.push('/')
  }

  const refreshToken = async () => {
    try {
      // tokenの有効期限
      const isValid = (date: string) => {
        return dayjs().diff(date, 'hours') < 1
      }

      if (auth && isValid(auth.now)) {
        let { data } = await axios.post(`${apiPath}/token/`, null, {
          headers: {
            'X-MT-Authorization': `MTAuth sessionId=${auth?.sessionId}`,
          },
        })
        setToken({
          ...auth,
          accessToken: data.accessToken,
          now: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        })
        return true
      } else {
        throw new Error()
      }
    } catch (error) {
      console.error(error)
      logout()
      // throw new Error()
    }
  }

  return {
    auth,
    isAuthed,
    login,
    logout,
    logoutWithApi,
    refreshToken,
  }
}
