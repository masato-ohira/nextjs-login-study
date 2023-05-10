import { selector, selectorFamily } from 'recoil'
import axios from 'axios'
const apiPath = `/mt-admin/mt-data-api.cgi/v5/sites/4`

// selectorを使用して
// エントリーの一覧情報を取得するselectorを定義
export const entryList = selector({
  key: 'entries/entryList',
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
  key: 'entries/entryDetail',
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
