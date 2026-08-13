"use client"

import { MusicPlayer } from "@/components/player/MusicPlayer"
import { RideSidebar } from "@/components/share/RideSidebar"
import { Eye, EyeClosed } from "@phosphor-icons/react"
import { useEffect, useRef, useState } from "react"

const backgroundUrl =
  "https://b9gv7ayfo7fnz2sa.private.blob.vercel-storage.com/background.png?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfYjlndjdBWUZvN2ZOWjJzYSIsIm93bmVySWQiOiJ0ZWFtX0g4NFdwalpENWpMTG40eEVlRmxBVG0yRiIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzg2NzAwMDA2MzM4LCJpYXQiOjE3ODY2NTY4MDY1NzJ9.zNezCKkIY26Rn5EdJ8SQYmSqo6VDCnZg5bcmsPjEZ3M&vercel-blob-signature=p5aPeKtMHUah4viBbXHAliQCXbzRScZMY4IP_HdTnfA"

const videos = [
  {
    label: "1",
    src: "https://2zrygdluatzpeedr.public.blob.vercel-storage.com/videos_compressed/1.mp4",
    mood: "City",
  },
  {
    label: "2",
    src: "https://2zrygdluatzpeedr.public.blob.vercel-storage.com/videos_compressed/2.mp4",
    mood: "Scenic",
  },
]

export default function Page() {
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [activeVideo, setActiveVideo] = useState(0)
  const [isPlayAll, setIsPlayAll] = useState(false)
  const [isBackground, setIsBackground] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formattedTime = currentTime.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })

  const switchVideo = (idx: number, playAll = false) => {
    setIsBackground(false)
    setIsPlayAll(playAll)
    setActiveVideo(idx)

    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.load()
        videoRef.current.play().catch(() => {})
      }
    }, 50)
  }

  const showBackground = () => {
    setIsBackground(true)
    setIsPlayAll(false)
  }

  const handleVideoEnded = () => {
    if (isPlayAll) {
      switchVideo((activeVideo + 1) % videos.length, true)
    }
  }

  return (
    <main className="relative flex h-screen w-full flex-col overflow-hidden bg-zinc-950 font-sans text-white">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 bg-zinc-950">
        {isBackground ? (
          <img
            src={backgroundUrl}
            alt=""
            className="h-full w-full scale-105 object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            src={videos[activeVideo].src}
            loop={!isPlayAll}
            onEnded={handleVideoEnded}
            muted
            playsInline
            preload="metadata"
            poster={backgroundUrl}
            className="h-full w-full scale-105 object-cover transition-all duration-700"
          />
        )}

        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/80 transition-opacity duration-1000 ${
            isFocusMode ? "opacity-30" : "opacity-100"
          }`}
        />
      </div>

      {/* Video / Background Switcher */}
      <div className="absolute bottom-8 left-8 z-[100] flex items-center gap-2">
        {videos.map((v, i) => (
          <button
            key={i}
            onClick={() => switchVideo(i, false)}
            title={v.mood}
            className={`flex h-9 w-9 items-center justify-center rounded-full border text-[11px] font-bold backdrop-blur-md transition-all hover:scale-110 ${
              !isBackground && !isPlayAll && activeVideo === i
                ? "border-amber-500 bg-amber-500/20 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                : "border-white/10 bg-black/40 text-white/60 hover:border-white/30 hover:text-white"
            }`}
          >
            {v.label}
          </button>
        ))}

        {/* Play All */}
        <button
          onClick={() => switchVideo(0, true)}
          title="Play All"
          className={`flex h-9 w-9 items-center justify-center rounded-full border text-base backdrop-blur-md transition-all hover:scale-110 ${
            !isBackground && isPlayAll
              ? "border-amber-500 bg-amber-500/20 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]"
              : "border-white/10 bg-black/40 text-white/60 hover:border-white/30 hover:text-white"
          }`}
        >
          ∞
        </button>

        {/* Background Image */}
        <button
          onClick={showBackground}
          title="Background Image"
          className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm backdrop-blur-md transition-all hover:scale-110 ${
            isBackground
              ? "border-amber-500 bg-amber-500/20 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]"
              : "border-white/10 bg-black/40 text-white/60 hover:border-white/30 hover:text-white"
          }`}
        >
          ▧
        </button>
      </div>

      {/* Focus Mode Toggle */}
      <button
        onClick={() => setIsFocusMode(!isFocusMode)}
        className="absolute right-8 bottom-8 z-[100] flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/70 shadow-xl backdrop-blur-md transition-all hover:scale-110 hover:bg-white/10 hover:text-white"
        title={isFocusMode ? "Show Interface" : "Focus on Ride"}
      >
        {isFocusMode ? (
          <EyeClosed size={24} weight="fill" />
        ) : (
          <Eye size={24} weight="fill" />
        )}
      </button>

      {/* HUD */}
      <div
        className={`relative z-10 flex h-full w-full flex-col transition-opacity duration-700 ease-in-out ${
          isFocusMode ? "opacity-0 hover:opacity-100" : "opacity-100"
        }`}
      >
        {/* Top Bar */}
        <header className="flex w-full items-center justify-between p-8">
          {/* Left */}
          <div
            className="flex items-center gap-4 transition-opacity duration-500"
            style={{ opacity: isFocusMode ? 0 : 1 }}
          >
            <div className="flex flex-col">
              <h1 className="text-[26px] leading-none font-black tracking-wide text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                ऑटो की सवारी
              </h1>
              <p className="mt-1.5 text-[11px] font-bold tracking-[0.3em] text-white/70 drop-shadow-md">
                NH 48 • DELHI - MUMBAI
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col items-end gap-2">
            <div className="text-2xl font-bold tracking-wider drop-shadow-md">
              <span className="text-lg font-medium text-white/80">
                {formattedTime}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-white/80 drop-shadow-sm">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]" />
                212 <span className="text-white/50">ABOARD</span>
              </div>

              <button className="flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-1.5 text-xs font-medium backdrop-blur-md transition-colors hover:border-white/40 hover:bg-white/10">
                <div className="flex h-5 w-5 items-center justify-center overflow-hidden rounded-full bg-white">
                  <span className="text-[10px] font-bold text-black">You</span>
                </div>
                Who&apos;s driving?
              </button>
            </div>
          </div>
        </header>

        <RideSidebar />
        <MusicPlayer />
      </div>

      {/* Center Title */}
      <div
        className={`absolute left-1/2 z-10 flex flex-col items-center justify-center transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isFocusMode
            ? "top-8 -translate-x-1/2 scale-[0.3]"
            : "top-[36%] -translate-x-1/2 -translate-y-1/2 scale-100"
        }`}
      >
        <p
          className={`mb-5 text-[12px] font-bold tracking-[0.5em] text-amber-500/90 uppercase drop-shadow-md transition-opacity duration-500 ${
            isFocusMode ? "opacity-0" : "opacity-100"
          }`}
        >
          X Tracks • Non-Stop
        </p>

        <h2
          className="text-[60px] leading-none font-black tracking-tight text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]"
          style={{ fontFamily: "sans-serif", lineHeight: "1" }}
        >
          ऑटो की सवारी
        </h2>
      </div>
    </main>
  )
}
