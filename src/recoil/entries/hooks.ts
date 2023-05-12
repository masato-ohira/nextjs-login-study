import {
  useRecoilValueLoadable,
  useRecoilValue,
  useRecoilRefresher_UNSTABLE,
} from 'recoil'
import axios from 'axios'
import { useRouter } from 'next/router'
import { isString, orderBy } from 'lodash-es'

import { tokenAtom } from '@/recoil/auth/index'
import { entryDetail, entryList } from '@/recoil/entries'
import type { EntryType } from '@/recoil/entries/types'

const apiPath = `/mt-admin/mt-data-api.cgi/v5/sites/4`

// エントリーリストの値を読み込むカスタムフック
export const useEntries = () => {
  // entryListを取得する
  const loadable = useRecoilValueLoadable(entryList)
  // contentsプロパティをmodifiedDateで降順にソートし
  // データと読み込み状態を返す
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
  const refreshList = useRecoilRefresher_UNSTABLE(entryList)

  // Recoilのselectorを使用して
  // 詳細を更新するための関数
  const refreshDetail = useRecoilRefresher_UNSTABLE(entryDetail(routeID))

  // 記事を新規追加するための関数
  const addEntry = async ({
    title,
    body,
  }: Pick<EntryType, 'title' | 'body'>) => {
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

  // 記事を編集するための関数
  const editEntry = async ({
    id,
    title,
    body,
  }: Pick<EntryType, 'id' | 'title' | 'body'>) => {
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

  // 記事を削除するための関数
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
