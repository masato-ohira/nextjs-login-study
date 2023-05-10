import MarkdownIt from 'markdown-it'
import { Box } from '@chakra-ui/react'
import type { BoxProps } from '@chakra-ui/react'
import { cloneDeep } from 'lodash-es'
import { githubCss } from './Markdown.styles'
// import { css } from '@emotion/react'

const mdOptions: any = {
  injected: true,
  breaks: true,
  html: true,
  linkify: false,
  typography: true,
}
const md = new MarkdownIt(mdOptions)

interface MdProps extends BoxProps {
  children?: string
}

export const Markdown = (props: MdProps) => {
  let opts: any = cloneDeep(props)
  delete opts.children
  return (
    <>
      <Box
        {...opts}
        css={githubCss}
        dangerouslySetInnerHTML={{ __html: md.render(props.children || '') }}
      ></Box>
    </>
  )
}
