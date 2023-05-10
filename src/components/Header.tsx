import { Box, Button, Flex, Text, HStack } from '@chakra-ui/react'
import React from 'react'
import { LogoutButton } from '@/components/LogoutButton'
import { MdAdd, MdLogout } from 'react-icons/md'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { includes } from 'lodash-es'

export const Header = () => {
  const router = useRouter()
  const isEntry = includes(router.pathname, '/entry')
  return (
    <Box position={'relative'} pt={'60px'}>
      <Flex
        bgColor={'white'}
        shadow={'sm'}
        px={6}
        h={'60px'}
        justifyContent={'space-between'}
        alignItems={'center'}
        position={'fixed'}
        left={0}
        top={0}
        w={'full'}
        zIndex={6000}
      >
        <NextLink href={`/mypage/`}>
          <HStack spacing={4}>
            <Text fontWeight={'bold'} fontSize={'xl'}>
              APP NAME
            </Text>
            {isEntry && <Button size={'sm'}>一覧に戻る</Button>}
          </HStack>
        </NextLink>
        <HStack spacing={3}>
          <NextLink href='/mypage/entry/add/'>
            <Button
              size={'sm'}
              leftIcon={<MdAdd size={20} />}
              iconSpacing={1}
              colorScheme={'blue'}
            >
              新規登録
            </Button>
          </NextLink>
          <LogoutButton />
        </HStack>
      </Flex>
    </Box>
  )
}
