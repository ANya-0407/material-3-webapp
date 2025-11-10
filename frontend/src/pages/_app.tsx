import 'src/styles/globals.css'
import type { AppProps } from 'next/app'
import "@fortawesome/fontawesome-svg-core/styles.css"
import { config } from "@fortawesome/fontawesome-svg-core"
config.autoAddCss = false

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default App;