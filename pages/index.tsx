import type { NextPage } from 'next'
import { Layout } from '../components/Layout'
import axios from 'axios'
import * as Yup from 'yup'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm, yupResolver } from '@mantine/form'
import { AuthForm } from '../types'
import { ExclamationCircleIcon, ShieldCheckIcon } from '@heroicons/react/solid'
import {
  Alert,
  Anchor,
  Button,
  Group,
  PasswordInput,
  TextInput,
} from '@mantine/core'
import { IconDatabase } from '@tabler/icons'

const schema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('No email provided'),
  password: Yup.string()
    .required('No password provided')
    .min(5, 'Password should be min 5 chars'),
})

const Home: NextPage = () => {
  const router = useRouter()
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState('')
  const form = useForm<AuthForm>({
    validate: yupResolver(schema),
    initialValues: {
      email: '',
      password: '',
    },
  })
  const handleSubmit = async () => {
    try {
      if (isRegister) {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
          email: form.values.email,
          password: form.values.password,
        })
      }
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        email: form.values.email,
        password: form.values.password,
      })
      form.reset()
      router.push('/dashboard')
    } catch (e: any) {
      setError(e.response.data.message)
    }
  }
  return (
    <Layout title="Auth">
      <ShieldCheckIcon className="h-16 w-16 text-blue-500" />
      {error && (
        <Alert
          my="md"
          variant="filled"
          icon={<ExclamationCircleIcon />}
          title="Authorization Error"
          color="red"
          radius="md"
        >
          {error}
        </Alert>
      )}
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          mt="md"
          id="email"
          label="Email*"
          placeholder="example@sample.com"
          {...form.getInputProps('email')}
        />
        <PasswordInput
          mt="md"
          id="password"
          placeholder="Must be min 5 chars"
          label="Password*"
          {...form.getInputProps('password')}
        />
        <Group mt="xl" position="apart">
          <Anchor
            component="button"
            type="button"
            size="xs"
            className="text-gray-300"
            onClick={() => {
              setIsRegister(!isRegister)
              setError('')
            }}
          >
            {isRegister
              ? 'Have an account? Login'
              : "Don't have an account? Register"}
          </Anchor>
          <Button
            leftIcon={<IconDatabase size={14} />}
            color="cyan"
            type="submit"
          >
            {isRegister ? 'Register' : 'Login'}
          </Button>
        </Group>
      </form>
    </Layout>
  )
}

export default Home
