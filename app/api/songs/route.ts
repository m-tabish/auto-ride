import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const KNOWN_ARTISTS = [
  "Alka Yagnik", "Mohammed Aziz", "Kumar Sanu", "Sonu Nigam", "Shreya Ghoshal",
  "Udit Narayan", "Kishore Kumar", "Lata Mangeshkar", "Asha Bhosle", "Bayaan",
  "Arijit Singh", "Mohammad Rafi", "Mukesh", "R.D. Burman", "S.P. Balasubrahmanyam",
  "K.S. Chithra", "Kavita Krishnamurthy", "Sadhana Sargam", "Anuradha Paudwal",
  "Abhijeet Bhattacharya", "Hariharan"
];

const HARDCODED_SONGS: Record<string, { title: string; artist: string }> = {
  "bahut-jatate-ho.mp3": {
    title: "Bahut Jatate Ho Chah Humse",
    artist: "Alka Yagnik, Mohammed Aziz",
  },
  "Bahut Jatate Ho Chah Humse With Lyrics  Alka Yagnik, Mohammed Aziz  Aadmi Khilona Hai 1993 Songs.mp3": {
    title: "Bahut Jatate Ho Chah Humse",
    artist: "Alka Yagnik, Mohammed Aziz",
  },
  "hui-aankh-nam.mp3": {
    title: "Hui Aankh Nam",
    artist: "Bayaan",
  },
  "Hui Aankh Nam.mp3": {
    title: "Hui Aankh Nam",
    artist: "Bayaan",
  },
  "mujhse-mohabbat.mp3": {
    title: "Mujhse Mohabbat Ka Izhaar",
    artist: "Kumar Sanu, Alka Yagnik",
  },
  "Mujhse Mohabbat Ka Izhaar .mp3": {
    title: "Mujhse Mohabbat Ka Izhaar",
    artist: "Kumar Sanu, Alka Yagnik",
  },
  "Sona-Kitna-Sona-Hai.mp3": {
    title: "Sona Kitna Sona Hai",
    artist: "Alka Yagnik, Udit Narayan",
  },
  "Main Agar Kahoon.mp3": {
    title: "Main Agar Kahoon",
    artist: "Sonu Nigam, Shreya Ghoshal",
  }
};

function capitalizeWords(str: string): string {
  return str
    .split(" ")
    .map(word => {
      if (!word) return "";
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function parseSongFile(filename: string): { title: string; artist: string } {
  const normalizedKey = filename.trim();
  if (HARDCODED_SONGS[normalizedKey]) {
    return HARDCODED_SONGS[normalizedKey];
  }

  // Strip extension
  let base = filename.replace(/\.mp3$/i, "").trim();

  // Try splitting by common delimiters: " - ", " – ", "  " (double spaces), or " _ "
  let parts: string[] = [];
  if (base.includes(" - ")) {
    parts = base.split(" - ");
  } else if (base.includes(" – ")) {
    parts = base.split(" – ");
  } else if (base.includes("  ")) {
    parts = base.split("  ");
  } else if (base.includes("_")) {
    parts = base.split("_");
  }

  let title = base;
  let artist = "Old Bollywood";

  if (parts.length >= 2) {
    let artistIdx = -1;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i].toLowerCase();
      if (KNOWN_ARTISTS.some(ka => part.includes(ka.toLowerCase()))) {
        artistIdx = i;
        break;
      }
    }

    if (artistIdx !== -1) {
      artist = parts[artistIdx].trim();
      title = parts.filter((_, idx) => idx !== artistIdx).join(" ").trim();
    } else {
      title = parts[0].trim();
      artist = parts[1].trim();
    }
  } else {
    const foundArtist = KNOWN_ARTISTS.find(ka => base.toLowerCase().includes(ka.toLowerCase()));
    if (foundArtist) {
      artist = foundArtist;
      title = base.replace(new RegExp(foundArtist, "gi"), "").replace(/\s+/g, " ").trim();
    } else {
      title = base.replace(/[-_]/g, " ").trim();
    }
  }

  title = title.replace(/\s+/g, " ").trim();
  title = capitalizeWords(title);
  artist = capitalizeWords(artist);

  // Strip common junk words
  title = title
    .replace(/\bwith lyrics\b/gi, "")
    .replace(/\blyrics\b/gi, "")
    .replace(/\bofficial\b/gi, "")
    .replace(/\bsong\b/gi, "")
    .replace(/\bvideo\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!title) {
    title = base.replace(/[-_]/g, " ").trim();
  }

  return { title, artist };
}

export async function GET() {
  const rootSongsDir = path.join(process.cwd(), "assets", "songs");
  const publicSongsDir = path.join(process.cwd(), "public", "assets", "songs");

  // Ensure public songs directory exists
  if (!fs.existsSync(publicSongsDir)) {
    fs.mkdirSync(publicSongsDir, { recursive: true });
  }

  // Synchronize root assets directory to public assets directory
  if (fs.existsSync(rootSongsDir)) {
    try {
      const rootFiles = fs.readdirSync(rootSongsDir);
      for (const file of rootFiles) {
        if (file.toLowerCase().endsWith(".mp3")) {
          const srcPath = path.join(rootSongsDir, file);
          const destPath = path.join(publicSongsDir, file);
          if (!fs.existsSync(destPath)) {
            fs.copyFileSync(srcPath, destPath);
          }
        }
      }
    } catch (err) {
      console.error("Error syncing songs:", err);
    }
  }

  // Read all songs in public assets directory
  let songs: Array<{ title: string; artist: string; src: string }> = [];
  try {
    const publicFiles = fs.readdirSync(publicSongsDir);
    // Sort files alphabetically to keep a stable order
    publicFiles.sort((a, b) => a.localeCompare(b));

    for (const file of publicFiles) {
      if (file.toLowerCase().endsWith(".mp3")) {
        const { title, artist } = parseSongFile(file);
        songs.push({
          title,
          artist,
          src: `/assets/songs/${encodeURIComponent(file)}`,
        });
      }
    }
  } catch (err) {
    console.error("Error listing public songs:", err);
  }

  // Fallback to static playlist if no songs are found
  if (songs.length === 0) {
    songs = [
      {
        title: "Bahut Jatate Ho Chah Humse",
        artist: "Alka Yagnik, Mohammed Aziz",
        src: "/assets/songs/bahut-jatate-ho.mp3",
      },
      {
        title: "Hui Aankh Nam",
        artist: "Bayaan",
        src: "/assets/songs/hui-aankh-nam.mp3",
      },
      {
        title: "Mujhse Mohabbat Ka Izhaar",
        artist: "Kumar Sanu, Alka Yagnik",
        src: "/assets/songs/mujhse-mohabbat.mp3",
      },
    ];
  }

  return NextResponse.json(songs);
}
