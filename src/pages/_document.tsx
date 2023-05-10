import Document, { Head, Html, Main, NextScript } from 'next/document'

const fontFamilies = [
  `family=Noto+Sans+JP:wght@300;400;500;700;900`,
  `display=swap`,
]

const fontIcons = [`Material+Icons`, `Material+Icons+Outlined`]

// class Document extends NextDocument {
class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            rel='stylesheet'
            href={`https://fonts.googleapis.com/icon?family=${fontIcons.join(
              '%7C',
            )}`}
          />
          <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link
            rel='preconnect'
            href='https://fonts.gstatic.com'
            crossOrigin=''
          />
          <link
            rel='stylesheet'
            href={`https://fonts.googleapis.com/css2?${fontFamilies.join('&')}`}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
export default MyDocument
