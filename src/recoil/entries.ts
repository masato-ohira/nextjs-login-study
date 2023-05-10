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

export const entriesSelector = selector({
  key: 'entriesSelector',
  get: async () => {
    try {
      const { data } = await axios.get(`${apiPath}/entries/`)
      return data.items
    } catch (error) {
      console.log({ error })
      return []
      // throw new Error()
      // console.error({ error })
    }
  },
})

export const entryDetail = selectorFamily({
  key: 'entryDetail',
  get: (id: string) => async () => {
    try {
      const { data } = await axios.get(`${apiPath}/entries/${id}/`)
      return data
    } catch (error) {
      console.log({ error })
      return []
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

export const useEntryDetail = () => {
  const router = useRouter()
  const routeID = isString(router.query.id) ? router.query.id : ''
  const loadable = useRecoilValueLoadable(entryDetail(routeID))

  return {
    data: loadable.contents,
    state: loadable.state,
  }
}

export const useEntryControl = () => {
  const auth = useRecoilValue(tokenAtom)
  const router = useRouter()
  const routeID = isString(router.query.id) ? router.query.id : ''

  const refreshList = useRecoilRefresher_UNSTABLE(entriesSelector)
  const refreshDetail = useRecoilRefresher_UNSTABLE(entryDetail(routeID))

  type EditEntryType = {
    id: string
    title: string
    body: string
  }

  const addEntry = async ({ title, body }: { title: string; body: string }) => {
    try {
      const params = new URLSearchParams()
      params.append(
        'entry',
        JSON.stringify({
          title,
          body,
        }),
      )
      params.append('publish', '1')
      const { data } = await axios.post(`${apiPath}/entries/`, params, {
        headers: {
          'X-MT-Authorization': `MTAuth accessToken=${auth?.accessToken}`,
        },
      })
      console.log(data)
      await refreshList()
      return true
    } catch (error) {
      console.log({ error })
      return false
    }
  }

  const editEntry = async ({ id, title, body }: EditEntryType) => {
    try {
      const params = new URLSearchParams()
      params.append(
        'entry',
        JSON.stringify({
          title,
          body,
        }),
      )
      params.append('publish', '1')
      const { data } = await axios.put(`${apiPath}/entries/${id}/`, params, {
        headers: {
          'X-MT-Authorization': `MTAuth accessToken=${auth?.accessToken}`,
        },
      })
      console.log(data)

      await Promise.all([refreshDetail(), refreshList()])
      return true
    } catch (error) {
      console.log({ error })
      return false
    }
  }

  const deleteEntry = async (id: string) => {
    try {
      const { data } = await axios.delete(`${apiPath}/entries/${id}/`, {
        headers: {
          'X-MT-Authorization': `MTAuth accessToken=${auth?.accessToken}`,
        },
      })
      console.log(data)
      await refreshList()
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
