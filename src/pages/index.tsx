import { useForm } from 'react-hook-form'
import { get } from 'lodash-es'

import {
  Box,
  Center,
  Input,
  Stack,
  FormLabel,
  FormControl,
  Button,
  FormErrorMessage,
  useToast,
} from '@chakra-ui/react'

import { useMtAuth } from '@/recoil/auth/hooks'
import { useRouter } from 'next/router'
import type { LoginParams } from '@/recoil/auth/types'

const LoginPage = () => {
  const { login } = useMtAuth()
  const router = useRouter()
  const toast = useToast()

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<LoginParams>()

  const onSubmit = async (data: any) => {
    try {
      await login(data)
      toast({
        title: 'ログインしました',
        status: 'success',
        duration: 4000,
        isClosable: true,
      })
      router.push('/mypage')
      return true
    } catch (error) {
      toast({
        title: 'ログインに失敗しました',
        description: 'ユーザー名かパスワードが正しくありません。',
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
      return false
    }
  }

  const hasError = (key: string) => {
    if (get(errors, key)) {
      return true
    } else {
      return false
    }
  }

  return (
    <Center minHeight={'100vh'}>
      <Box
        shadow={'md'}
        p={6}
        py={12}
        minW={'md'}
        bgColor={'#fff'}
        rounded={'md'}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            <FormControl isInvalid={hasError('username')}>
              <FormLabel>ユーザー名</FormLabel>
              <Input
                type={'text'}
                {...register('username', {
                  required: '必須項目です',
                })}
              />
              <FormErrorMessage>
                {get(errors, 'username.message')}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={hasError('password')}>
              <FormLabel>パスワード</FormLabel>
              <Input
                type={'password'}
                {...register('password', {
                  required: '必須項目です',
                })}
              />
              <FormErrorMessage>
                {get(errors, 'password.message')}
              </FormErrorMessage>
            </FormControl>
            <Center pt={3}>
              <Button
                colorScheme={'blue'}
                minW={'3xs'}
                isLoading={isSubmitting}
                type='submit'
              >
                ログイン
              </Button>
            </Center>
          </Stack>
        </form>
      </Box>
    </Center>
  )
}

export default LoginPage
