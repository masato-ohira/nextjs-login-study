import {
  selector,
  selectorFamily,
  useRecoilValueLoadable,
  useRecoilValue,
  useRecoilRefresher_UNSTABLE,
} from 'recoil'
import axios from 'axios'
import { useRouter } from 'next/router'
import { isString, orderBy } from 'lodash-es'
import { tokenAtom } from './auth'

const apiPath = `/mt-admin/mt-data-api.cgi/v5/sites/4`

export type EntryType = {
  id: number
  basename: string
  title: string
  body: string
  date: string
  createdDate: string
  modifiedDate: string
  assets: any[]
}

// selectorを使用して
// エントリーの一覧情報を取得するselectorを定義
export const entriesSelector = selector({
  key: 'entriesSelector',
  get: async () => {
    try {
      // axiosを使用して、APIからエントリーの一覧情報を取得
      const { data } = await axios.get(`${apiPath}/entries/`)
      // エントリーの一覧情報から、itemsの配列のみを抽出して返す
      return data.items
    } catch (error) {
      // エラーが発生した場合は、その内容を出力
      console.log({ error })
      // 空の配列を返す
      return []
    }
  },
})

// selectorFamilyを使用して
// 特定のエントリーの詳細情報を取得するselectorを定義
export const entryDetail = selectorFamily({
  key: 'entryDetail',
  get: (id: string) => async () => {
    try {
      // axiosを使用して、APIから詳細情報を取得
      const { data } = await axios.get(`${apiPath}/entries/${id}/`)

      // 取得した詳細情報を返す
      return data
    } catch (error) {
      // エラーが発生した場合は、その内容を出力
      console.log({ error })

      // nullを返す
      return null
    }
  },
})

// hooks
// ------------------------------
export const useEntries = () => {
  const loadable = useRecoilValueLoadable(entriesSelector)
  return {
    data: orderBy(loadable.contents, 'modifiedDate', 'desc'),
    state: loadable.state,
  }
}

// エントリーの詳細情報を取得するカスタムフックの定義
export const useEntryDetail = () => {
  // クエリパラメーターのidを取得
  const router = useRouter()
  const routeID = isString(router.query.id) ? router.query.id : ''

  // Recoilのloadableを使用して
  // エントリーの詳細情報を取得
  const loadable = useRecoilValueLoadable(entryDetail(routeID))

  // 取得した詳細情報と状態を返す
  return {
    data: loadable.contents, // 詳細情報の内容
    state: loadable.state, // 読み込み状態（'hasValue', 'loading', 'hasError'のいずれか）
  }
}

export const useEntryControl = () => {
  // Recoilのatomを使用して認証情報を取得
  const auth = useRecoilValue(tokenAtom)

  // クエリパラメーターのidを取得
  const router = useRouter()
  const routeID = isString(router.query.id) ? router.query.id : ''

  // Recoilのselectorを使用して
  // 一覧を更新するための関数
  const refreshList = useRecoilRefresher_UNSTABLE(entriesSelector)

  // Recoilのselectorを使用して
  // 詳細を更新するための関数
  const refreshDetail = useRecoilRefresher_UNSTABLE(entryDetail(routeID))

  // EditEntryType型を定義
  type EditEntryType = {
    id: string
    title: string
    body: string
  }

  const addEntry = async ({ title, body }: { title: string; body: string }) => {
    try {
      // 送信するパラメータを設定
      const params = new URLSearchParams()
      params.append(
        'entry',
        JSON.stringify({
          title,
          body,
        }),
      )
      params.append('publish', '1')

      // axiosを使用してAPIエンドポイントにデータをPOST
      const { data } = await axios.post(`${apiPath}/entries/`, params, {
        // MTAuthを使った認証情報をリクエストヘッダーに含める
        headers: {
          'X-MT-Authorization': `MTAuth accessToken=${auth?.accessToken}`,
        },
      })
      console.log(data)

      // 一覧を更新するためにrefreshList関数を実行
      await refreshList()

      // 追加が成功した場合はtrueを返す
      return true
    } catch (error) {
      console.log({ error })
      return false
    }
  }

  const editEntry = async ({ id, title, body }: EditEntryType) => {
    try {
      // 送信するパラメータを設定
      const params = new URLSearchParams()
      params.append(
        'entry',
        JSON.stringify({
          title,
          body,
        }),
      )
      params.append('publish', '1')

      // axiosを使用してAPIエンドポイントにデータをPUT
      const { data } = await axios.put(`${apiPath}/entries/${id}/`, params, {
        // MTAuthを使った認証情報をリクエストヘッダーに含める
        headers: {
          'X-MT-Authorization': `MTAuth accessToken=${auth?.accessToken}`,
        },
      })
      console.log(data)

      // 一覧と詳細を更新するためにPromise.allで
      // refreshDetailとrefreshListを実行
      await Promise.all([refreshDetail(), refreshList()])

      // 編集が成功した場合はtrueを返す
      return true
    } catch (error) {
      console.log({ error })
      return false
    }
  }

  const deleteEntry = async (id: string) => {
    try {
      // axiosを使用して、APIからエントリーを削除
      const { data } = await axios.delete(`${apiPath}/entries/${id}/`, {
        headers: {
          'X-MT-Authorization': `MTAuth accessToken=${auth?.accessToken}`,
        },
      })

      console.log(data)

      // Recoilのselectorを使用して
      // 一覧を更新するための関数を実行
      await refreshList()

      // 削除が成功した場合はtrueを返す
      return true
    } catch (error) {
      console.log({ error })
      return false
    }
  }

  return {
    addEntry,
    editEntry,
    deleteEntry,
  }
}
