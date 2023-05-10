export type TokenType = {
  accessToken: string
  expiresIn: number
  remember: boolean
  sessionId: string
  now: string
} | null

export type LoginParams = {
  username: string
  password: string
}
