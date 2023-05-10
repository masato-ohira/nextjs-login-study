import dynamic from 'next/dynamic'
import { includes } from 'lodash-es'

import { useEntryDetail, useEntryControl } from '@/recoil/entries/hooks'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { Loading } from '@/components/Loading'
import {
  Box,
  Button,
  FormControl,
  HStack,
  Input,
  Stack,
} from '@chakra-ui/react'
// import { css } from '@emotion/react'

const MDEditor = dynamic(
  async () => {
    const editor = await import('@uiw/react-md-editor')
    await import('@uiw/react-md-editor/markdown-editor.css')
    await import('@uiw/react-markdown-preview/markdown.css')
    return editor
  },
  { ssr: false },
)

export const EntryDetail = () => {
  const { data, state } = useEntryDetail()
  const { addEntry, editEntry, deleteEntry } = useEntryControl()
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  const isAddPage = includes(router.pathname, '/add')

  const editorProps: any = {
    value: content,
    onChange: (e: any) => {
      setContent(e)
    },
    height: `calc(100vh - 200px)`,
  }

  const saveAction = async () => {
    setSaving(true)
    try {
      if (isAddPage) {
        await addEntry({
          title,
          body: content,
        })
        setSaving(false)
        return true
      } else {
        await editEntry({
          id: data.id,
          title,
          body: content,
        })
        setSaving(false)
        return true
      }
    } catch (error) {
      setSaving(false)
      return false
    }
  }
  const saveAndGoList = async () => {
    await saveAction()
    router.push('/mypage/')
  }

  const delAction = async () => {
    if (confirm('削除してよろしいですか？')) {
      setDeleting(true)
      try {
        await deleteEntry(data.id)
        setDeleting(false)
        router.push('/mypage/')
        return true
      } catch (error) {
        setDeleting(false)
        return false
      }
    }
  }

  useEffect(() => {
    if (data.body) {
      setContent(data.body)
      setTitle(data.title)
    }
  }, [data.body])

  if (state == 'loading') return <Loading />
  if (state == 'hasError') return <></>

  // setContent(data.body)

  return (
    <>
      <Box p={10}>
        <Stack spacing={6}>
          <HStack justifyContent={'space-between'} spacing={10}>
            <FormControl maxWidth={'container.xl'}>
              <Input
                bgColor={'white'}
                placeholder={'タイトルを入力'}
                defaultValue={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                }}
              />
            </FormControl>
            <HStack spacing={4}>
              {!isAddPage && (
                <Button
                  minW={'140px'}
                  colorScheme={'blue'}
                  onClick={saveAction}
                  isDisabled={saving || deleting}
                >
                  保存する
                </Button>
              )}
              <Button
                minW={'140px'}
                colorScheme={'green'}
                onClick={saveAndGoList}
                isDisabled={saving || deleting}
              >
                保存して一覧へ
              </Button>
              {!isAddPage && (
                <Button
                  minW={'140px'}
                  colorScheme={'red'}
                  onClick={delAction}
                  isDisabled={saving || deleting}
                >
                  削除する
                </Button>
              )}
            </HStack>
          </HStack>
          <Box>
            <MDEditor
              {...editorProps}
              // css={css`
              //   .w-md-editor-area {
              //     background-color: #222;
              //     color: #fff;
              //     border-radius: 0;
              //     border: none;

              //     a {
              //       color: var(--chakra-colors-blue-200);
              //     }
              //   }
              // `}
            />
          </Box>
        </Stack>
      </Box>
    </>
  )
}
