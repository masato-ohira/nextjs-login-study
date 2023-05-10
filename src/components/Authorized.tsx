import { useMtAuth } from '@/recoil/auth'
import { Box } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import { Loading } from './Loading'
import { Header } from './Header'

// 認証されたユーザーしかアクセスできないページに
// アクセスするためのコンポーネント
export const Authorized = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const { isAuthed, refreshToken } = useMtAuth()

  useEffect(() => {
    // ページが読み込まれた時に認証済みかどうかチェックし
    // 認証済みであればトークンを更新し、子要素を表示する
    const init = async () => {
      if (isAuthed()) {
        await refreshToken()
        setReady(true)
      } else {
        // 認証されていなければ、ログイン画面に遷移する
        router.push('/')
      }
    }
    init()
  }, [router.pathname])

  // ローディング画面を表示する
  if (!ready) return <Loading />
  // 認証されている場合、ヘッダーと子要素を表示する
  if (isAuthed())
    return (
      <>
        <Header />
        <Box>{children}</Box>
      </>
    )
  // 認証されていない場合、何も表示しない
  return <></>
}
