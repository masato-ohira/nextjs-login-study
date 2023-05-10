import dayjs from 'dayjs'
import NextLink from 'next/link'

import { useEntries } from '@/recoil/entries/hooks'
import type { EntryType } from '@/recoil/entries/types'

import { Loading } from './Loading'
import { Container, Box, Grid, Text, Stack } from '@chakra-ui/react'

export const EntryList = () => {
  const { data, state } = useEntries()

  if (state == 'loading') return <Loading />
  if (state == 'hasError') return <></>

  return (
    <Container
      py={10}
      minW={{
        base: 'auto',
        md: 'container.md',
        lg: 'container.xl',
      }}
    >
      <Grid templateColumns={'repeat(3, 1fr)'} gap={6}>
        {data.map((i: EntryType) => {
          return (
            <NextLink href={`/mypage/entry/${i.id}/`} key={i.id}>
              <Box
                p={8}
                rounded={'md'}
                shadow={'md'}
                bgColor={'#fff'}
                _hover={{
                  opacity: 0.7,
                }}
              >
                <Stack spacing={2}>
                  <Text fontSize={'xl'} fontWeight={'bold'}>
                    {i.title}
                  </Text>
                  <Stack spacing={0}>
                    <Text fontSize={'sm'} color={'gray.500'}>
                      更新日 :{' '}
                      {dayjs(i.modifiedDate).format('YYYY/MM/DD HH:mm')}
                    </Text>
                    <Text fontSize={'sm'} color={'gray.500'}>
                      作成日 : {dayjs(i.createdDate).format('YYYY/MM/DD HH:mm')}
                    </Text>
                  </Stack>
                </Stack>
              </Box>
            </NextLink>
          )
        })}
      </Grid>
    </Container>
  )
}
