import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'
import type { TokenType } from '@/recoil/auth/types'

const { persistAtom } = recoilPersist({
  // 保存するためのキーを設定
  key: 'login-demo-recoil',
  // windowが存在する場合、localStorageを使用して永続化
  // windowが存在しない場合、undefinedを指定して非永続化
  storage: typeof window === 'undefined' ? undefined : localStorage,
})

// アクセストークン情報を管理するatomを定義
export const tokenAtom = atom<TokenType>({
  key: 'auth/tokenAtom', // atomの一意のキー
  default: null, // 初期値はnullとする
  effects_UNSTABLE: [persistAtom], // persistAtomを使用して、永続化する
})
