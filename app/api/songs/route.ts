import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const HARDCODED_SONGS: Record<string, { title: string; artist: string }> = {
  "Bahut Jatate Ho Chah Humse With Lyrics  Alka Yagnik, Mohammed Aziz  Aadmi Khilona Hai 1993 Songs.mp3": {
    title: "Bahut Jatate Ho Chah Humse",
    artist: "Alka Yagnik, Mohammed Aziz",
  },
  "Hui Aankh Nam.mp3": {
    title: "Hui Aankh Nam",
    artist: "Bayaan",
  },
  "Main Agar Kahoon.mp3": {
    title: "Main Agar Kahoon",
    artist: "Sonu Nigam, Shreya Ghoshal",
  },
  "Mujhse Mohabbat Ka Izhaar .mp3": {
    title: "Mujhse Mohabbat Ka Izhaar",
    artist: "Kumar Sanu, Alka Yagnik",
  },
  "Sona-Kitna-Sona-Hai.mp3": {
    title: "Sona Kitna Sona Hai",
    artist: "Alka Yagnik, Udit Narayan",
  }
};

export async function GET() {
  // Feed your clean, public Vercel Blob URLs directly here
  const songs = [
    {
      title: HARDCODED_SONGS["Hui Aankh Nam.mp3"].title,
      artist: HARDCODED_SONGS["Hui Aankh Nam.mp3"].artist,
      src: "https://vercel-storage.com",
    },
    {
      title: HARDCODED_SONGS["Mujhse Mohabbat Ka Izhaar .mp3"].title,
      artist: HARDCODED_SONGS["Mujhse Mohabbat Ka Izhaar .mp3"].artist,
      src: "https://vercel-storage.com",
    },
    {
      title: HARDCODED_SONGS["Sona-Kitna-Sona-Hai.mp3"].title,
      artist: HARDCODED_SONGS["Sona-Kitna-Sona-Hai.mp3"].artist,
      src: "https://vercel-storage.com",
    },
    {
      title: HARDCODED_SONGS["Bahut Jatate Ho Chah Humse With Lyrics  Alka Yagnik, Mohammed Aziz  Aadmi Khilona Hai 1993 Songs.mp3"].title,
      artist: HARDCODED_SONGS["Bahut Jatate Ho Chah Humse With Lyrics  Alka Yagnik, Mohammed Aziz  Aadmi Khilona Hai 1993 Songs.mp3"].artist,
      src: "https://vercel-storage.com",
    },
    {
      title: HARDCODED_SONGS["Main Agar Kahoon.mp3"].title,
      artist: HARDCODED_SONGS["Main Agar Kahoon.mp3"].artist,
      src: "https://vercel-storage.com", // Make sure this matches your exact Main Agar Kahoon blob link
    }
  ];

  return NextResponse.json(songs);
}
