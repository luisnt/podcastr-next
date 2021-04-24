import Image from "next/image"
import { useEffect, useRef, useState } from "react"

import Slider from "rc-slider"
import "rc-slider/assets/index.css"
import { usePlayer } from "../../contexts/PlayerContextProvider"

import css from "./style.module.scss"
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString"

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [progress, setProgress] = useState(0)

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    isLooping,
    isShuffling,
    playNext,
    playPrevious,
    clearPlayerState,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    setPlayingState,
    hasPrevious,
    hasNext
  } = usePlayer()

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }

  }, [isPlaying])

  function setupProgressListener() {
    audioRef.current.currentTime = 0

    audioRef.current.addEventListener("timeupdate", event => {
      setProgress(Math.floor(audioRef.current.currentTime))
    })
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount
    setProgress(amount)
  }

  function handleEpisodeEnded() {
    if (hasNext) {
      playNext()
      return;
    }
    clearPlayerState()
  }

  const episode = episodeList[currentEpisodeIndex]

  return (
    <div className={css.container}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora {episode?.title}</strong>
      </header>
      { episode ? (
        <div className={css.currentEpisode} >
          <div className={css.Image}>
            <Image
              width={592}
              height={592}
              src={episode.thumbnail}
              objectFit="cover"
            />
          </div>
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={css.emptyPlayer} >
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )
      }
      <footer className={!episode ? css.empty : ""}>
        <div className={css.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={css.slider}>
            {episode ? (
              <Slider
                onChange={handleSeek}
                max={episode.duration}
                value={progress}
                trackStyle={{ backgroundColor: "#04d361" }}
                railStyle={{ backgroundColor: "#9f75ff" }}
                handleStyle={{ borderColor: "#04d361", borderWidth: 4 }}
              />
            ) : (
              <div className={css.emptySlider} />
            )}

          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {episode && (
          <audio
            src={episode.url}
            ref={audioRef}
            autoPlay
            loop={isLooping}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onLoadedMetadata={setupProgressListener}
            onEnded={handleEpisodeEnded}
          />
        )}

        <div className={css.buttons}>
          <button
            type="button"
            disabled={!episode || episodeList.length === 1}
            onClick={toggleShuffle}
            className={isShuffling ? css.isActive : ""}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button
            type="button"
            disabled={!episode || !hasPrevious}
            onClick={playPrevious}
          >
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>
          <button
            type="button"
            className={css.playButton}
            disabled={!episode}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <img src="/pause.svg" alt="Pausar" />
            ) : (
              <img src="/play.svg" alt="Tocar" />
            )}
          </button>
          <button
            type="button"
            disabled={!episode || !hasNext}
            onClick={playNext}
          >
            <img src="/play-next.svg" alt="Tocar proxíma" />
          </button>
          <button
            type="button"
            disabled={!episode}
            onClick={toggleLoop}
            className={isLooping ? css.isActive : ""}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div >
  )
}