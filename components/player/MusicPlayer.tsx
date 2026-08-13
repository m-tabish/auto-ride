"use client"

import { Song, playlist as staticPlaylist } from "@/components/player/playlist"
import {
  ListDashes,
  Pause,
  Play,
  Repeat,
  SkipBack,
  SkipForward,
  SpeakerHigh,
} from "@phosphor-icons/react"
import { useEffect, useRef, useState } from "react"

export function MusicPlayer() {
  const [playlist, setPlaylist] = useState<Song[]>(staticPlaylist)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const audioRef = useRef<HTMLAudioElement>(null)

  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const [isQueueOpen, setIsQueueOpen] = useState(false)

  useEffect(() => {
    let active = true

    async function loadPlaylist() {
      try {
        const res = await fetch("/api/songs")

        if (!res.ok) {
          throw new Error("Failed to fetch songs")
        }

        const data = await res.json()

        if (active && Array.isArray(data) && data.length > 0) {
          setPlaylist(data)
        }
      } catch (err) {
        console.error("Failed to load playlist dynamically:", err)
      }
    }

    loadPlaylist()

    return () => {
      active = false
    }
  }, [])

  const currentSong = playlist[currentSongIndex] || staticPlaylist[0]

  const handleNext = () => {
    if (playlist.length === 0) return

    setCurrentSongIndex((prev) => (prev + 1) % playlist.length)
  }

  const handlePrev = () => {
    if (playlist.length === 0) return

    setCurrentSongIndex(
      (prev) => (prev - 1 + playlist.length) % playlist.length
    )
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || duration <= 0) return

    const bounds = e.currentTarget.getBoundingClientRect()

    const percent = Math.max(
      0,
      Math.min(1, (e.clientX - bounds.left) / bounds.width)
    )

    audioRef.current.currentTime = percent * duration
  }

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      setTimeout(() => {
        audioRef.current?.play().catch(() => {})

        const videoEl = document.querySelector("video")

        if (videoEl) {
          videoEl.play().catch(() => {})
        }
      }, 50)
    }
  }, [currentSongIndex])

  const togglePlay = () => {
    if (!audioRef.current) return

    const videoEl = document.querySelector("video")

    if (isPlaying) {
      audioRef.current.pause()

      if (videoEl) {
        videoEl.pause()
      }

      setIsPlaying(false)
    } else {
      audioRef.current.play().catch(() => {})

      if (videoEl) {
        videoEl.play().catch(() => {})
      }

      setIsPlaying(true)
    }
  }

  const toggleMute = () => {
    if (!audioRef.current) return

    const newMutedState = !isMuted

    audioRef.current.muted = newMutedState

    setIsMuted(newMutedState)
  }

  const toggleRepeat = () => {
    setIsRepeat((prev) => !prev)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      if (e.code === "Space") {
        e.preventDefault()
        togglePlay()
      } else if (e.code === "ArrowRight") {
        if (audioRef.current) {
          audioRef.current.currentTime += 5
        }
      } else if (e.code === "ArrowLeft") {
        if (audioRef.current) {
          audioRef.current.currentTime -= 5
        }
      } else if (e.code === "KeyN") {
        handleNext()
      } else if (e.code === "KeyP") {
        handlePrev()
      } else if (e.code === "KeyQ") {
        setIsQueueOpen((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [playlist.length, isPlaying])

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const formatTime = (time: number) => {
    if (!Number.isFinite(time)) return "0:00"

    const min = Math.floor(time / 60)
    const sec = Math.floor(time % 60)

    return `${min}:${sec.toString().padStart(2, "0")}`
  }

  const progressPercent =
    duration > 0
      ? Math.min(100, Math.max(0, (currentTime / duration) * 100))
      : 0

  return (
    <div className="fixed bottom-3 left-0 z-[150] flex w-full flex-col items-center gap-2 px-3 sm:bottom-8 sm:left-1/2 sm:w-auto sm:-translate-x-1/2 sm:px-0">
      {/* AUDIO */}
      <audio
        ref={audioRef}
        src={currentSong?.src}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          if (isRepeat) {
            if (audioRef.current) {
              audioRef.current.currentTime = 0
              audioRef.current.play().catch(() => {})
            }
          } else {
            handleNext()
          }
        }}
      />

      {/* =========================================================
          QUEUE
          ========================================================= */}
      {isQueueOpen && (
        <div className="absolute right-2 bottom-full mb-3 max-h-[55vh] w-[calc(100vw-24px)] overflow-y-auto rounded-2xl border border-white/10 bg-[#1a0f0a]/95 p-3 shadow-[0_-20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl sm:right-0 sm:mb-4 sm:w-[300px] sm:rounded-3xl sm:p-4">
          <h4 className="mb-3 text-[10px] font-bold tracking-[0.2em] text-amber-500/80 uppercase">
            Queue
          </h4>

          <div className="flex flex-col gap-1.5">
            {playlist.map((song, idx) => (
              <button
                key={`${song.title}-${idx}`}
                onClick={() => {
                  setCurrentSongIndex(idx)
                  setIsQueueOpen(false)
                }}
                className={`group flex min-w-0 items-center gap-3 rounded-xl p-2 text-left transition-all active:scale-[0.98] ${
                  idx === currentSongIndex
                    ? "border border-amber-500/30 bg-white/5"
                    : "border border-transparent hover:bg-white/10"
                }`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    idx === currentSongIndex
                      ? "bg-amber-500 text-black"
                      : "bg-white/10 text-white"
                  }`}
                >
                  {idx === currentSongIndex ? (
                    <Play weight="fill" size={16} />
                  ) : (
                    <span className="text-[10px] font-bold">{idx + 1}</span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <span
                    className={`block truncate text-[13px] font-bold ${
                      idx === currentSongIndex ? "text-amber-400" : "text-white"
                    }`}
                  >
                    {song.title}
                  </span>

                  <span className="block truncate text-[10px] font-medium text-white/50">
                    {song.artist}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          PLAYER
          ========================================================= */}
      <div className="flex h-[72px] w-full max-w-[580px] items-center gap-2 rounded-[22px] border border-white/10 bg-[#23150c]/90 px-2.5 py-2 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:h-[74px] sm:w-[580px] sm:gap-4 sm:rounded-[37px] sm:px-3 sm:py-0">
        {/* ALBUM ART */}
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-orange-500/30 sm:h-14 sm:w-14">
          <img
            src="https://images.unsplash.com/photo-1619983081563-430f63602796?w=200&h=200&fit=crop"
            alt="Album Art"
            className={`h-full w-full object-cover ${
              isPlaying ? "animate-[spin_4s_linear_infinite]" : ""
            }`}
          />
        </div>

        {/* SONG INFO */}
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="min-w-0">
            <h3 className="truncate text-[12px] font-bold tracking-wide text-white sm:text-[15px]">
              {currentSong?.title}
            </h3>

            <p className="truncate text-[9px] font-medium text-white/50 sm:text-[11px]">
              {currentSong?.artist}
            </p>
          </div>

          {/* PROGRESS */}
          <div className="mt-1.5 flex min-w-0 items-center gap-2 text-[8px] font-medium text-white/40 sm:gap-3 sm:text-[10px]">
            <span className="hidden w-6 shrink-0 text-right sm:block">
              {formatTime(currentTime)}
            </span>

            <div
              className="group relative h-1.5 min-w-0 flex-1 cursor-pointer overflow-hidden rounded-full bg-black/50 sm:h-2"
              onClick={handleSeek}
            >
              <div
                className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-amber-600 to-orange-500 shadow-[0_0_8px_rgba(234,88,12,0.8)]"
                style={{
                  width: `${progressPercent}%`,
                }}
              />

              <div className="absolute top-0 h-full w-full bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>

            <span className="hidden w-6 shrink-0 sm:block">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex shrink-0 items-center gap-1.5 text-[#a3948b] sm:gap-5 sm:pr-4">
          {/* PREVIOUS */}
          <button
            onClick={handlePrev}
            className="hidden transition-all hover:scale-110 hover:text-white active:scale-95 sm:block"
            aria-label="Previous"
          >
            <SkipBack weight="fill" size={18} />
          </button>

          {/* PLAY */}
          <button
            onClick={togglePlay}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all hover:scale-105 active:scale-95 sm:h-10 sm:w-10"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause weight="fill" size={17} />
            ) : (
              <Play weight="fill" size={17} className="ml-0.5" />
            )}
          </button>

          {/* NEXT */}
          <button
            onClick={handleNext}
            className="transition-all hover:scale-110 hover:text-white active:scale-95"
            aria-label="Next"
          >
            <SkipForward weight="fill" size={18} />
          </button>

          {/* MUTE */}
          <button
            onClick={toggleMute}
            className={`hidden transition-all hover:scale-110 active:scale-95 sm:block ${
              isMuted ? "text-white/40" : "hover:text-white"
            }`}
            aria-label="Mute"
          >
            <SpeakerHigh weight="fill" size={18} />
          </button>

          {/* REPEAT */}
          <button
            onClick={toggleRepeat}
            className={`hidden transition-all hover:scale-110 active:scale-95 sm:block ${
              isRepeat ? "text-amber-500" : "hover:text-white"
            }`}
            aria-label="Repeat"
          >
            <Repeat weight="bold" size={18} />
          </button>

          {/* QUEUE */}
          <button
            onClick={() => setIsQueueOpen((prev) => !prev)}
            className={`transition-all hover:scale-110 active:scale-95 ${
              isQueueOpen ? "text-white" : "hover:text-white"
            }`}
            aria-label="Queue"
          >
            <ListDashes weight="bold" size={18} />
          </button>
        </div>
      </div>

      {/* =========================================================
          KEYBOARD SHORTCUTS
          ========================================================= */}
      <div className="hidden items-center gap-6 font-mono text-[9px] font-bold tracking-[0.2em] text-white/30 uppercase md:flex">
        <div className="flex items-center gap-2">
          <span className="rounded-md border border-white/10 bg-black/40 px-2 py-1">
            Space
          </span>
          <span>PLAY / PAUSE</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="rounded-md border border-white/10 bg-black/40 px-2 py-1">
            ←
          </span>

          <span className="rounded-md border border-white/10 bg-black/40 px-2 py-1">
            →
          </span>

          <span className="ml-1">SEEK</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="rounded-md border border-white/10 bg-black/40 px-2 py-1">
            N
          </span>

          <span className="rounded-md border border-white/10 bg-black/40 px-2 py-1">
            P
          </span>

          <span className="ml-1">TRACK</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-md border border-white/10 bg-black/40 px-2 py-1">
            Q
          </span>

          <span>QUEUE</span>
        </div>
      </div>
    </div>
  )
}
