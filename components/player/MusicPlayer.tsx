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
        if (!res.ok) throw new Error("Failed to fetch songs")
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
    setCurrentSongIndex((prev) => (prev + 1) % playlist.length)
  }

  const handlePrev = () => {
    setCurrentSongIndex(
      (prev) => (prev - 1 + playlist.length) % playlist.length
    )
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && duration > 0) {
      const bounds = e.currentTarget.getBoundingClientRect()
      const percent = (e.clientX - bounds.left) / bounds.width
      audioRef.current.currentTime = percent * duration
    }
  }

  useEffect(() => {
    // Autoplay when song changes if it was already playing
    if (isPlaying && audioRef.current) {
      setTimeout(() => {
        audioRef.current?.play().catch(console.error)
        const videoEl = document.querySelector("video")
        if (videoEl) videoEl.play()
      }, 50)
    }
  }, [currentSongIndex])

  const togglePlay = () => {
    if (audioRef.current) {
      const videoEl = document.querySelector("video")
      if (isPlaying) {
        audioRef.current.pause()
        if (videoEl) videoEl.pause()
      } else {
        audioRef.current.play()
        if (videoEl) videoEl.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleRepeat = () => {
    setIsRepeat(!isRepeat)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return

      if (e.code === "Space") {
        e.preventDefault()
        if (audioRef.current) {
          const videoEl = document.querySelector("video")
          if (audioRef.current.paused) {
            audioRef.current.play()
            if (videoEl) videoEl.play()
            setIsPlaying(true)
          } else {
            audioRef.current.pause()
            if (videoEl) videoEl.pause()
            setIsPlaying(false)
          }
        }
      } else if (e.code === "ArrowRight") {
        if (audioRef.current) audioRef.current.currentTime += 5
      } else if (e.code === "ArrowLeft") {
        if (audioRef.current) audioRef.current.currentTime -= 5
      } else if (e.code === "KeyN") {
        setCurrentSongIndex((prev) => (prev + 1) % playlist.length)
      } else if (e.code === "KeyP") {
        setCurrentSongIndex(
          (prev) => (prev - 1 + playlist.length) % playlist.length
        )
      } else if (e.code === "KeyQ") {
        setIsQueueOpen((prev) => !prev)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [playlist.length])

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
    if (isNaN(time)) return "0:00"
    const min = Math.floor(time / 60)
    const sec = Math.floor(time % 60)
    return `${min}:${sec.toString().padStart(2, "0")}`
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="fixed bottom-8 left-1/2 z-[150] flex -translate-x-1/2 flex-col items-center gap-4">
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={currentSong.src}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          if (isRepeat) {
            if (audioRef.current) {
              audioRef.current.currentTime = 0
              audioRef.current.play()
            }
          } else {
            handleNext()
          }
        }}
      />

      {/* Queue Popup */}
      {isQueueOpen && (
        <div className="absolute right-0 bottom-full z-[200] mb-4 w-[300px] rounded-3xl border border-white/10 bg-[#1a0f0a]/95 p-4 shadow-[0_-20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
          <h4 className="mb-4 text-[10px] font-bold tracking-[0.2em] text-amber-500/80 uppercase">
            Queue
          </h4>
          <div className="flex flex-col gap-2">
            {playlist.map((song, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentSongIndex(idx)
                  setIsQueueOpen(false)
                }}
                className={`group flex items-center gap-3 rounded-2xl p-2 text-left transition-all hover:bg-white/10 active:scale-95 ${idx === currentSongIndex ? "border border-amber-500/30 bg-white/5" : "border border-transparent"}`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${idx === currentSongIndex ? "bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]" : "bg-white/10 text-white group-hover:bg-white/20"}`}
                >
                  {idx === currentSongIndex ? (
                    <Play weight="fill" size={16} className="ml-0.5" />
                  ) : (
                    <span className="text-[10px] font-bold">{idx + 1}</span>
                  )}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span
                    className={`truncate text-[13px] font-bold transition-colors ${idx === currentSongIndex ? "text-amber-400" : "text-white group-hover:text-amber-500/80"}`}
                  >
                    {song.title}
                  </span>
                  <span className="truncate text-[10px] font-medium text-white/50">
                    {song.artist}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Player Pill */}
      <div className="flex h-[74px] w-[580px] items-center gap-4 rounded-[37px] border border-white/10 bg-[#23150c]/85 px-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        {/* Album Art */}
        <div className="relative h-[56px] w-[56px] shrink-0 overflow-hidden rounded-full border border-orange-500/30 shadow-[0_0_15px_rgba(234,88,12,0.2)]">
          <img
            src="https://images.unsplash.com/photo-1619983081563-430f63602796?w=200&h=200&fit=crop"
            alt="Album Art"
            className={`h-full w-full object-cover ${isPlaying ? "animate-[spin_4s_linear_infinite]" : ""}`}
          />
        </div>

        {/* Song Info & Progress */}
        <div className="mt-1 flex flex-1 flex-col justify-center gap-1.5 truncate">
          <div className="truncate">
            <h3 className="truncate text-[15px] font-bold tracking-wide text-white">
              {currentSong.title}
            </h3>
            <p className="truncate text-[11px] font-medium text-white/50">
              {currentSong.artist}
            </p>
          </div>

          <div className="flex items-center gap-3 text-[10px] font-medium text-white/40">
            <span className="w-6 text-right">{formatTime(currentTime)}</span>
            {/* Progress Bar (Fare meter style) */}
            <div
              className="group relative h-2 flex-1 cursor-pointer overflow-hidden rounded-full bg-black/50"
              onClick={handleSeek}
            >
              <div
                className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-amber-600 to-orange-500 shadow-[0_0_8px_rgba(234,88,12,0.8)] transition-all duration-150"
                style={{ width: `${progressPercent}%` }}
              />
              <div className="absolute top-0 h-full w-full bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <span className="w-6">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-5 pr-4 text-[#a3948b]">
          <button
            onClick={handlePrev}
            className="transition-colors hover:scale-110 hover:text-white active:scale-95"
          >
            <SkipBack weight="fill" size={18} />
          </button>

          <button
            onClick={togglePlay}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all hover:scale-105 active:scale-95"
          >
            {isPlaying ? (
              <Pause weight="fill" size={18} />
            ) : (
              <span className="flex items-center justify-center">
                <Play weight="fill" size={18} style={{ marginLeft: "2px" }} />
              </span>
            )}
          </button>

          <button
            onClick={handleNext}
            className="transition-colors hover:scale-110 hover:text-white active:scale-95"
          >
            <SkipForward weight="fill" size={18} />
          </button>

          <button
            onClick={toggleMute}
            className={`transition-colors hover:scale-110 active:scale-95 ${isMuted ? "text-white/40" : "ml-1 hover:text-white"}`}
          >
            <SpeakerHigh weight="fill" size={18} />
          </button>

          <button
            onClick={toggleRepeat}
            className={`transition-colors hover:scale-110 active:scale-95 ${isRepeat ? "text-amber-500" : "hover:text-white"}`}
          >
            <Repeat weight="bold" size={18} />
          </button>

          <button
            onClick={() => setIsQueueOpen(!isQueueOpen)}
            className={`transition-colors hover:scale-110 active:scale-95 ${isQueueOpen ? "text-white" : "hover:text-white"}`}
          >
            <ListDashes weight="bold" size={18} />
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="flex items-center gap-6 font-mono text-[9px] font-bold tracking-[0.2em] text-white/30 uppercase">
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
