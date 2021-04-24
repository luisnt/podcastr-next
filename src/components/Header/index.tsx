import Switch from "rc-switch"

import format from "date-fns/format"
import ptBR from "date-fns/locale/pt-BR"

// import "rc-switch/assets/index.css"

import css from "./style.module.scss"

export function Header() {
  const currentDate = format(new Date(), "EEEEEE, d MMMM", { locale: ptBR })

  function setVarCSS(name, color) {
    document.documentElement.style.setProperty(name, color);
  }

  function onChange(value, event) {
    if (value) {
      setVarCSS("--white", "#191622")
      setVarCSS("--gray-50", "#000")
      setVarCSS("--gray-100", "#afb2b1")
      setVarCSS("--gray-200", "#bebec3")
      setVarCSS("--gray-500", "#c7c7c8")
      setVarCSS("--gray-800", "#dadada")
      setVarCSS("--green-500", "#67E480")
      setVarCSS("--purple-300", "#6f48c9")
      setVarCSS("--purple-400", "#8257e5")
      setVarCSS("--purple-500", "#9164fa")
      setVarCSS("--purple-800", "#9f75ff")

      return;
    }
    setVarCSS("--white", "#fff")
    setVarCSS("--gray-50", "#f7f8fa")
    setVarCSS("--gray-100", "#e6e8eb")
    setVarCSS("--gray-200", "#afb2b1")
    setVarCSS("--gray-500", "#808080")
    setVarCSS("--gray-800", "#494d4b")
    setVarCSS("--green-500", "#04d361")
    setVarCSS("--purple-300", "#9f75ff")
    setVarCSS("--purple-400", "#9164fa")
    setVarCSS("--purple-500", "#8257e5")
    setVarCSS("--purple-800", "#6f48c9")

  }

  return (
    <header className={css.container}>
      <div className={css.Switch}>
        <Switch
          onChange={onChange}
        />
      </div>
      <img src="/logo.svg" alt="Podcasts" />

      <p>O melhor para você ouvir, sempre</p>

      <span>{currentDate}</span>
    </header>
  )
}