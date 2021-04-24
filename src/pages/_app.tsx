import React from "react"
import "../styles/global.scss"

import { PlayerContextProvider } from "../contexts/PlayerContextProvider"
import { Header } from "../components/Header"
import { Player } from "../components/Player"

import css from "../styles/app.module.scss"

function MyApp({ Component, pageProps }) {
  return (
    <PlayerContextProvider>
      <div className={css.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContextProvider>
  )
}

export default MyApp
