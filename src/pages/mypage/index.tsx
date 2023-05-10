import { EntryList } from '@/components/EntryList'
import NoSSR from 'react-no-ssr'

const HomePage = () => {
  return (
    <NoSSR>
      <EntryList />
    </NoSSR>
  )
}

export default HomePage
