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

export type EditEntryType = Pick<EntryType, 'id' | 'title' | 'body'>
