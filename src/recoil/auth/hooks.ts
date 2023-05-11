import axios from 'axios'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import dayjs from 'dayjs'

import { tokenAtom } from '@/recoil/auth'
import type { LoginParams } from '@/recoil/auth/types'

const apiPath = `/mt-admin/mt-data-api.cgi/v5`

// hooks
// ------------------------------
export const useMtAuth = () => {
  // tokenAtomの状態を管理する
  const [auth, setToken] = useRecoilState(tokenAtom)
  const router = useRouter()

  // 認証状態を判定する関数を定義
  const hasAuth = () => {
    if (auth) {
      return true
    } else {
      return false
    }
  }

  // ログイン関数の定義
  const login = async (params: LoginParams) => {
    try {
      // 認証情報の初期化
      setToken(null)
      // API に送信するパラメータの初期化
      const apiParams = new URLSearchParams()

      /// ユーザー名とパスワードをパラメータにセット
      apiParams.append('username', params.username)
      apiParams.append('password', params.password)
      apiParams.append('clientId', 'demo')

      // 認証情報を取得するAPIにパラメータを送信
      let { data } = await axios.post(`${apiPath}/authentication/`, apiParams, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })

      // 認証情報をセット
      // 認証情報に現在の日時を追加して保存
      setToken({
        ...data,
        now: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      })
      return true
    } catch (error) {
      // コンソールにエラーを表示して、エラーをスローする
      console.error(error)
      throw new Error()
    }
  }

  // APIを使用してログアウトする関数
  const logoutWithApi = async () => {
    try {
      // 認証状態の場合は、APIを使用してログアウトを実行する
      if (auth) {
        // 認証情報を含むAPIのエンドポイントを呼び出す
        await axios.delete(`${apiPath}/authentication/`, {
          headers: {
            // X-MT-Authorizationヘッダーに認証情報を設定する
            'X-MT-Authorization': `MTAuth sessionId=${auth?.sessionId}`,
          },
        })
      }
      // ローカルのトークンを初期化
      setToken(null)
      // ルーターを使用してトップページに遷移する
      router.push('/')
    } catch (error) {
      // エラーが発生した場合はトップページに遷移する
      router.push('/')
    }
  }

  // ログアウト関数
  const logout = () => {
    // ローカルのトークンを初期化
    setToken(null)
    // ルーターを使用してトップページに遷移する
    router.push('/')
  }

  // トークンを更新するための非同期関数
  const refreshToken = async () => {
    try {
      // トークンの有効期限を判定する関数
      const isValid = (date: string) => {
        return dayjs().diff(date, 'hours') < 1
      }

      const canRefresh = (date: string) => {
        return dayjs().diff(date, 'hours') > 0.5
      }

      // 認証情報が存在しており、かつ有効期限内である場合
      if (auth && isValid(auth.now)) {
        // トークン更新時刻から30分以上経過している場合は
        // APIを介してトークンを更新する
        // ※ この処理でAPIの過剰なリクエストを抑制する
        if (canRefresh(auth.now)) {
          // トークンを更新するためのPOSTリクエストを送信する
          let { data } = await axios.post(`${apiPath}/token/`, null, {
            headers: {
              'X-MT-Authorization': `MTAuth sessionId=${auth?.sessionId}`,
            },
          })
          // トークンを更新し、現在時刻を設定する
          setToken({
            ...auth,
            accessToken: data.accessToken,
            now: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          })
        }

        // trueを返す
        return true
      } else {
        // 認証情報が存在しない、または有効期限が切れている場合
        // エラーをスローする
        throw new Error()
      }
    } catch (error) {
      console.error(error)
      logout()
    }
  }

  return {
    auth,
    hasAuth,
    login,
    logout,
    logoutWithApi,
    refreshToken,
  }
}
