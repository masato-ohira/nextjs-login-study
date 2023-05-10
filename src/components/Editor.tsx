import dynamic from 'next/dynamic'
const AceEditor = dynamic(
  async () => {
    const ace = await import('react-ace')
    await import('ace-builds/src-noconflict/mode-markdown')
    await import('ace-builds/src-noconflict/theme-monokai')
    await import('ace-builds/src-noconflict/ext-language_tools')
    return ace
  },
  { ssr: false },
)

export const Editor = () => {
  return (
    <AceEditor
      mode='markdown'
      theme='monokai'
      name='UNIQUE_ID_OF_DIV'
      editorProps={{ $blockScrolling: true }}
      height='100%'
      width='100%'
      fontSize={16}
    />
  )
}
