"use client"
import { MusicPlayer } from "@/components/player/MusicPlayer"
import { RideSidebar } from "@/components/share/RideSidebar"
import { Eye, EyeClosed } from "@phosphor-icons/react"
import { Analytics } from "@vercel/analytics/next"
import { useEffect, useRef, useState } from "react"

const backgroundUrl =
  "https://2zrygdluatzpeedr.public.blob.vercel-storage.com/background.png"

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
      {/* BACKGROUND */}
      <Analytics />
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

      {/* =========================================================
          MOBILE VIDEO CONTROLS
          ========================================================= */}
      <div
        className={`absolute bottom-[158px] left-3 z-[100] flex items-center gap-2 transition-all duration-500 sm:bottom-8 sm:left-8 ${
          isFocusMode ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        {videos.map((v, i) => (
          <button
            key={i}
            onClick={() => switchVideo(i, false)}
            title={v.mood}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold backdrop-blur-md transition-all hover:scale-110 ${
              !isBackground && !isPlayAll && activeVideo === i
                ? "border-amber-500 bg-amber-500/20 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                : "border-white/10 bg-black/50 text-white/60 hover:border-white/30 hover:text-white"
            }`}
          >
            {v.label}
          </button>
        ))}

        {/* PLAY ALL */}
        <button
          onClick={() => switchVideo(0, true)}
          title="Play All"
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-base backdrop-blur-md transition-all hover:scale-110 ${
            !isBackground && isPlayAll
              ? "border-amber-500 bg-amber-500/20 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]"
              : "border-white/10 bg-black/50 text-white/60 hover:border-white/30 hover:text-white"
          }`}
        >
          ∞
        </button>

        {/* BACKGROUND */}
        <button
          onClick={showBackground}
          title="Background Image"
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm backdrop-blur-md transition-all hover:scale-110 ${
            isBackground
              ? "border-amber-500 bg-amber-500/20 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]"
              : "border-white/10 bg-black/50 text-white/60 hover:border-white/30 hover:text-white"
          }`}
        >
          ▧
        </button>
      </div>

      {/* =========================================================
          FOCUS MODE BUTTON
          ========================================================= */}
      <button
        onClick={() => setIsFocusMode((prev) => !prev)}
        className={`absolute right-3 bottom-[158px] z-[110] flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white/80 shadow-xl backdrop-blur-md transition-all hover:scale-110 hover:bg-white/10 hover:text-white sm:right-8 sm:bottom-8 sm:h-12 sm:w-12 ${
          isFocusMode ? "border-white/30 bg-white/10 text-white" : ""
        }`}
        title={isFocusMode ? "Show Interface" : "Focus on Ride"}
      >
        {isFocusMode ? (
          <EyeClosed size={20} weight="fill" />
        ) : (
          <Eye size={20} weight="fill" />
        )}
      </button>

      {/* =========================================================
          HUD
          ========================================================= */}
      <div
        className={`relative z-10 flex h-full w-full flex-col transition-opacity duration-700 ease-in-out ${
          isFocusMode ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        {/* TOP BAR */}
        <header className="flex w-full items-start justify-between p-4 sm:p-8">
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h1 className="max-w-[170px] text-[25px] leading-[0.9] font-black tracking-wide text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] sm:max-w-none sm:text-[26px]">
                ऑटो की सवारी
              </h1> 
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col items-end gap-2">
            <div className="text-xl font-bold tracking-wider drop-shadow-md sm:text-2xl">
              <span className="text-lg font-medium text-white/80">
                {formattedTime}
              </span>
            </div> 
          </div>
        </header>

        {/* SIDEBAR */}
        {/* <RideSidebar /> */}

        {/* MUSIC PLAYER */}
        <MusicPlayer />
      </div>

      {/* =========================================================
          CENTER TITLE
          ========================================================= */}
      <div
        className={`absolute left-1/2 z-10 flex w-[90%] flex-col items-center justify-center text-center transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isFocusMode
            ? "top-8 -translate-x-1/2 scale-[0.3]"
            : "top-[36%] -translate-x-1/2 -translate-y-1/2 scale-100"
        }`}
      >
        <p
          className={`mb-5 text-[10px] font-bold tracking-[0.35em] text-amber-500/90 uppercase drop-shadow-md transition-opacity duration-500 sm:text-[12px] sm:tracking-[0.5em] ${
            isFocusMode ? "opacity-0" : "opacity-100"
          }`}
        >
          X Tracks • Non-Stop
        </p>

        <h2
          className="text-[48px] leading-[0.9] font-black tracking-tight text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] sm:text-[60px] sm:leading-none"
          style={{
            fontFamily: "sans-serif",
            lineHeight: "0.9",
          }}
        >
          ऑटो की सवारी
        </h2>
      </div>
    </main>
  )
}
