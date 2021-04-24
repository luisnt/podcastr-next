import { GetStaticProps } from "next"
import Link from "next/link"
import Image from "next/image"
import Head from "next/head"

import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"

import { api } from "../services/api"
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString"

import css from "./home.module.scss"
import React from "react"
import { usePlayer } from "../contexts/PlayerContextProvider"

type Episode = {
  id: string
  title: string
  thumbnail: string
  members: string
  publishedAt: string
  duration: number
  durationAsString: string
  url: string
}

type HomeProps = {
  latestEpisodes: Episode[]
  allEpisodes: Episode[]
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  const { playList } = usePlayer()

  const episodesList = [...latestEpisodes, ...allEpisodes]

  return (
    <div className={css.homepage}>
      <Head>
        <title>Podcasts</title>
      </Head>

      <section className={css.latestEpisodes} >
        <h2>Últimos lançamentos</h2>
        <ul>
          {
            latestEpisodes.map((episode, index) => {
              return (
                <li key={episode.id}>
                  <Image
                    width={192}
                    height={192}
                    src={episode.thumbnail}
                    alt={episode.title}
                    objectFit="cover"
                  />

                  <div className={css.episodeDetails}>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                    <p>{episode.members}</p>
                    <span>{episode.publishedAt}</span>
                    <span>{episode.durationAsString}</span>
                  </div>
                  <button type="button" onClick={() => playList(episodesList, index)}>
                    <img src="/play-green.svg" alt="Tocar episódio" />
                  </button>

                </li>
              )
            })
          }
        </ul>
      </section>

      <section className={css.allEpisodes} >
        <h2>Todos episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              allEpisodes.map((episode, index) => {
                return (
                  <tr key={episode.id}>
                    <td className={css.img}>
                      <Image
                        width={120}
                        height={120}
                        src={episode.thumbnail}
                        alt={episode.title}
                        objectFit="cover"
                      />
                    </td>
                    <td>
                      <Link href={`/episodes/${episode.id}`}>
                        <a>{episode.title}</a>
                      </Link>
                    </td>
                    <td>{episode.members}</td>
                    <td className={css.data}>{episode.publishedAt}</td>
                    <td>{episode.durationAsString}</td>
                    <td>
                      <button type="button" onClick={() => playList(episodesList, index + latestEpisodes.length)}>
                        <img src="/play-green.svg" alt="Tocar episódio" />
                      </button>

                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get("episodes", {
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc"
    }
  })

  const episodes = data.map(episode => {
    const duration = Number(episode.file.duration)
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), "d MMM yy", { locale: ptBR }),
      duration,
      durationAsString: convertDurationToTimeString(duration),
      url: episode.file.url
    }
  })

  const latestEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)

  const oitoHoras = 60 * 60 * 8;
  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: oitoHoras,
  }
}