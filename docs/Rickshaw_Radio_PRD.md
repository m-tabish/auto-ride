# Rickshaw Radio — PRD
## A Cultural Auto-Rickshaw Ride Experience with Old Bollywood Music

**Version:** 1.0  
**Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Socket.io, PostgreSQL, Prisma, Redis  
**Target:** Production-ready, scalable to 5,000 concurrent users

---

## 1. Overview

Rickshaw Radio is a single-page immersive web experience that transports users into the nostalgic world of Indian auto-rickshaw rides, accompanied by curated old Bollywood songs. The background features looping POV videos of auto rides through different Indian cities. A minimal, culturally-styled music player sits at the bottom. A unique "Auto Share" feature lets users invite others to share a virtual ride by setting start location, destination, and travel time — creating a communal listening experience.

---

## 2. Core Features

### 2.1 Background Video Loop
- Full-screen looping videos of auto-rickshaw POV rides
- Seamless crossfade transitions between videos
- Time-of-day color grading overlay (morning/afternoon/evening/night)
- Subtle film grain and vignette overlay
- City badges that fade in during transitions (Delhi, Mumbai, Bangalore, Kolkata, Chennai, Jaipur)

### 2.2 Music Player
- Minimal bottom bar player (inspired by the screenshot)
- Play/Pause, Previous, Next, Volume, Progress
- Fare-meter styled progress indicator
- Now Playing: Song title, artist, film/year
- Spinning cassette/vinyl animation
- Playlist queue visible on expand
- Crossfade between songs (2 seconds)

### 2.3 Auto Share (Ride Sharing)
- Users can "Start a Ride" — set:
  - Start location (text input with Indian city autocomplete)
  - Destination (text input)
  - Travel time (slider: 5 min — 60 min)
  - Song preference (optional)
- Generate a shareable link/code
- Others can "Join a Ride" via link or 6-digit code
- Shared ride state: synchronized song playback, chat, passenger list
- Visual: Small passenger avatars in the player bar

### 2.4 Song Request System
- Request button opens modal
- Form: Song name, Artist, Film (optional), Why this song (optional)
- Requests stored in DB, admin queue
- Users can upvote pending requests

### 2.5 Analytics & Tracking
- **Live Listener Count:** Real-time unique active users via Socket.io + Redis
- **IP + Fingerprint Deduplication:** FingerprintJS + IP hash for accurate uniques
- **Song Analytics:** Play count, completion rate, avg listen duration, skip rate
- **Request Analytics:** Most requested, conversion rate, genre patterns
- **Geographic Data:** Country/city from IP geolocation
- **Session Metrics:** Session length, return visitor rate, bounce rate
- **Auto Share Metrics:** Rides created, avg passengers, avg travel time

### 2.6 Admin Dashboard (Protected Route)
- View all analytics
- Moderate song requests (approve/reject)
- Upload new songs (metadata + audio file)
- Upload new videos (metadata + video file)
- View live users map
- Export reports (CSV)

---

## 3. File Structure

```
radio/
├── app/
│   ├── page.tsx                    # Main single-page experience
│   ├── layout.tsx                  # Root layout with providers
│   ├── globals.css                 # Global styles, CSS variables
│   ├── api/
│   │   ├── analytics/
│   │   │   ├── track/route.ts      # POST: Track events
│   │   │   ├── live/route.ts       # GET: Live user count
│   │   │   └── report/route.ts     # GET: Analytics report (admin)
│   │   ├── songs/
│   │   │   ├── route.ts            # GET: List songs, POST: Add song (admin)
│   │   │   ├── [id]/route.ts       # GET: Song by ID
│   │   │   └── play/route.ts       # POST: Record play event
│   │   ├── requests/
│   │   │   ├── route.ts            # GET/POST: Song requests
│   │   │   └── [id]/vote/route.ts  # POST: Upvote request
│   │   ├── rides/
│   │   │   ├── route.ts            # POST: Create ride
│   │   │   ├── [code]/route.ts     # GET: Ride details
│   │   │   └── [code]/join/route.ts # POST: Join ride
│   │   └── socket/route.ts         # Socket.io handler
│   ├── admin/
│   │   ├── page.tsx                # Admin dashboard
│   │   ├── layout.tsx              # Admin layout with auth
│   │   └── login/page.tsx          # Admin login
│   └── share/
│       └── [code]/page.tsx         # Shared ride landing page
├── components/
│   ├── video/
│   │   ├── BackgroundVideo.tsx     # Full-screen video with transitions
│   │   ├── VideoOverlay.tsx        # Grain, vignette, time-of-day tint
│   │   └── CityBadge.tsx           # Animated city name badge
│   ├── player/
│   │   ├── MusicPlayer.tsx         # Main player container
│   │   ├── PlayerControls.tsx      # Play, pause, prev, next
│   │   ├── FareMeter.tsx           # Fare-meter progress bar
│   │   ├── VolumeControl.tsx       # Volume slider
│   │   ├── NowPlaying.tsx          # Song info + spinning cassette
│   │   ├── Playlist.tsx            # Expandable playlist
│   │   └── PassengerAvatars.tsx    # Shared ride passenger icons
│   ├── share/
│   │   ├── StartRideModal.tsx      # Create ride form
│   │   ├── JoinRideModal.tsx       # Join via code/link
│   │   ├── RideInfo.tsx            # Current ride display
│   │   └── RideChat.tsx            # Simple ride chat
│   ├── request/
│   │   ├── RequestModal.tsx        # Song request form
│   │   └── RequestList.tsx         # Pending requests with upvote
│   ├── analytics/
│   │   ├── LiveCounter.tsx         # Floating live user count
│   │   └── VisitorBadge.tsx        # "You are visitor #X" toast
│   ├── ui/                         # Reusable UI primitives
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   ├── Slider.tsx
│   │   ├── Input.tsx
│   │   └── Toast.tsx
│   └── layout/
│       ├── Header.tsx              # Minimal header with logo
│       └── Footer.tsx              # Minimal footer
├── hooks/
│   ├── useSocket.ts                # Socket.io connection hook
│   ├── useAnalytics.ts             # Analytics tracking hook
│   ├── useRide.ts                  # Ride state management
│   ├── usePlayer.ts                # Audio player logic
│   ├── useFingerprint.ts           # Browser fingerprint hook
│   └── useGeolocation.ts           # IP-based geolocation
├── lib/
│   ├── db.ts                       # Prisma client singleton
│   ├── redis.ts                    # Redis client
│   ├── socket.ts                   # Socket.io server setup
│   ├── analytics.ts                # Analytics service logic
│   ├── fingerprint.ts              # Fingerprint generation
│   ├── constants.ts                # App constants (cities, etc.)
│   └── utils.ts                    # Utility functions
├── types/
│   ├── song.ts                     # Song type definitions
│   ├── ride.ts                     # Ride type definitions
│   ├── analytics.ts                # Analytics type definitions
│   └── request.ts                  # Request type definitions
├── prisma/
│   └── schema.prisma               # Database schema
├── public/
│   ├── videos/                     # Auto ride videos (not in repo)
│   ├── songs/                      # Audio files (not in repo)
│   ├── images/
│   │   ├── cassette.png            # Cassette animation frames
│   │   ├── cities/                 # City badge backgrounds
│   │   └── grain.png               # Film grain overlay
│   └── favicon.ico
├── styles/
│   └── animations.css              # Keyframe animations
├── middleware.ts                   # Auth, rate limiting, analytics init
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── docker-compose.yml              # PostgreSQL + Redis + App
```

---

## 4. Database Schema (Prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Song {
  id          String   @id @default(cuid())
  title       String
  artist      String
  film        String?
  year        Int?
  filePath    String   // Relative path: /songs/filename.mp3
  duration    Int      // Seconds
  playCount   Int      @default(0)
  skipCount   Int      @default(0)
  totalListenTime Int  @default(0) // Seconds
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  plays       PlayEvent[]
  queueItems  QueueItem[]
}

model PlayEvent {
  id          String   @id @default(cuid())
  songId      String
  song        Song     @relation(fields: [songId], references: [id])
  visitorId   String
  startedAt   DateTime @default(now())
  endedAt     DateTime?
  duration    Int      // Seconds listened
  completed   Boolean  @default(false)
  skipped     Boolean  @default(false)
  source      String   // "radio", "ride", "request"

  @@index([songId])
  @@index([visitorId])
  @@index([startedAt])
}

model SongRequest {
  id          String   @id @default(cuid())
  songName    String
  artist      String?
  film        String?
  reason      String?
  votes       Int      @default(0)
  status      String   @default("pending") // pending, approved, rejected
  requesterId String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Visitor {
  id          String   @id @default(cuid())
  fingerprint String   @unique
  ipHash      String
  country     String?
  city        String?
  firstVisit  DateTime @default(now())
  lastVisit   DateTime @updatedAt
  visitCount  Int      @default(1)
  sessions    Session[]
}

model Session {
  id          String   @id @default(cuid())
  visitorId   String
  visitor     Visitor  @relation(fields: [visitorId], references: [id])
  startedAt   DateTime @default(now())
  endedAt     DateTime?
  duration    Int?     // Seconds
  pageViews   Int      @default(0)
  bounced     Boolean  @default(true)
}

model Ride {
  id          String   @id @default(cuid())
  code        String   @unique // 6-digit alphanumeric
  startLocation String
  destination String
  travelTime  Int      // Minutes
  songId      String?
  createdBy   String   // Visitor fingerprint
  createdAt   DateTime @default(now())
  expiresAt   DateTime
  isActive    Boolean  @default(true)
  passengers  Passenger[]
}

model Passenger {
  id          String   @id @default(cuid())
  rideId      String
  ride        Ride     @relation(fields: [rideId], references: [id])
  fingerprint String
  nickname    String?
  joinedAt    DateTime @default(now())
  leftAt      DateTime?
}

model Admin {
  id       String @id @default(cuid())
  username String @unique
  password String // bcrypt hashed
  role     String @default("admin")
}
```

---

## 5. API Contracts

### 5.1 Songs
```
GET /api/songs
Response: { songs: Song[], currentIndex: number }

GET /api/songs/[id]
Response: { song: Song }

POST /api/songs/play
Body: { songId: string, visitorId: string, source: string }
Response: { success: boolean }

POST /api/songs (admin)
Body: { title, artist, film, year, file, duration }
Response: { song: Song }
```

### 5.2 Analytics
```
POST /api/analytics/track
Body: { 
  event: "play" | "skip" | "complete" | "request" | "ride_create" | "ride_join",
  data: Record<string, any>,
  visitorId: string
}

GET /api/analytics/live
Response: { count: number }

GET /api/analytics/report (admin)
Query: ?from=ISO&to=ISO&groupBy=day|hour
Response: {
  totalVisitors,
  totalPlays,
  avgSessionDuration,
  topSongs: [],
  geoData: [],
  hourlyDistribution: []
}
```

### 5.3 Requests
```
GET /api/requests?status=pending
Response: { requests: SongRequest[] }

POST /api/requests
Body: { songName, artist?, film?, reason? }
Response: { request: SongRequest }

POST /api/requests/[id]/vote
Response: { votes: number }
```

### 5.4 Rides
```
POST /api/rides
Body: { startLocation, destination, travelTime, songId? }
Response: { ride: Ride, code: string }

GET /api/rides/[code]
Response: { ride: Ride & { passengers: Passenger[] } }

POST /api/rides/[code]/join
Body: { nickname? }
Response: { passenger: Passenger }
```

---

## 6. Component Specifications

### 6.1 BackgroundVideo
```typescript
interface BackgroundVideoProps {
  videos: Array<{
    id: string;
    src: string;      // /videos/delhi-morning.mp4
    city: string;
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  }>;
  currentVideoIndex: number;
  onVideoEnd: () => void;
}
```
- Two `<video>` elements for crossfade
- CSS transition: opacity 1.5s ease-in-out
- Preload next video
- Muted, autoplay, loop per video (but playlist advances)

### 6.2 MusicPlayer
```typescript
interface MusicPlayerProps {
  songs: Song[];
  currentSong: Song;
  isPlaying: boolean;
  progress: number; // 0-100
  volume: number;   // 0-1
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (percent: number) => void;
  onVolumeChange: (volume: number) => void;
}
```
- Fixed bottom bar, height 80px
- Glassmorphism background: `bg-black/40 backdrop-blur-md`
- Border-top: `1px solid rgba(255,255,255,0.1)`

### 6.3 FareMeter
```typescript
interface FareMeterProps {
  progress: number; // 0-100
  duration: number; // Total seconds
  currentTime: number; // Current seconds
}
```
- Custom styled progress bar
- Tick marks every 10%
- Color: amber-500 to orange-600 gradient
- Glow effect on the progress thumb

### 6.4 StartRideModal
```typescript
interface StartRideFormData {
  startLocation: string;
  destination: string;
  travelTime: number; // 5-60
  songPreference?: string;
}
```
- Indian cities autocomplete (hardcoded list of 50 major cities)
- Travel time slider with "min" display
- Generate code on submit
- Show shareable link + copy button

---

## 7. Real-Time Architecture (Socket.io)

### Events
```
// Client -> Server
"join_room": { room: string, fingerprint: string }
"leave_room": { room: string }
"sync_playback": { room: string, songId: string, progress: number, isPlaying: boolean }
"chat_message": { room: string, message: string, nickname: string }
"heartbeat": { fingerprint: string }

// Server -> Client
"room_update": { passengers: Passenger[], currentSong?: Song }
"playback_sync": { songId: string, progress: number, isPlaying: boolean }
"chat_message": { nickname: string, message: string, timestamp: Date }
"live_count": { count: number }
```

### Redis Structure
```
// Online users (TTL 60s)
SET "online:{fingerprint}" "{ipHash}" EX 60

// Ride rooms
SET "ride:{code}:passengers" "[fingerprint1, fingerprint2]"
STRING "ride:{code}:current_song" "{songId}"
STRING "ride:{code}:progress" "{seconds}"

// Rate limiting
SET "ratelimit:{ip}:{endpoint}" "count" EX 60
```

---

## 8. Analytics Implementation

### Visitor Identification
```typescript
function getVisitorId(fingerprint: string, ip: string): string {
  return crypto.createHash('sha256')
    .update(fingerprint + ip + process.env.SALT)
    .digest('hex')
    .slice(0, 16);
}
```

### Tracked Events
| Event | Trigger | Data |
|-------|---------|------|
| page_view | Page load | referrer, path |
| song_play | Click play/Auto-advance | songId, source |
| song_skip | Click next/close tab | songId, listenDuration |
| song_complete | Natural end | songId, totalDuration |
| request_submit | Form submit | requestId |
| request_vote | Upvote click | requestId |
| ride_create | Modal submit | code, travelTime |
| ride_join | Join submit | code |
| ride_leave | Disconnect/Leave | code, duration |

### Live Count Algorithm
1. Client connects → Socket.io registers fingerprint
2. Heartbeat every 30s → Redis SET with 60s TTL
3. Live count = Redis SCARD of "online:*" keys
4. Broadcast to all clients every 10s

---

## 9. Styling & Theme

### Color Palette
```css
:root {
  --rickshaw-amber: #F59E0B;
  --rickshaw-orange: #EA580C;
  --rickshaw-teal: #0F766E;
  --rickshaw-gold: #D97706;
  --rickshaw-cream: #FEF3C7;
  --rickshaw-night: #1C1917;
  --glass-bg: rgba(0, 0, 0, 0.4);
  --glass-border: rgba(255, 255, 255, 0.1);
}
```

### Typography
- Headings: `font-family: 'Playfair Display', serif;`
- Body: `font-family: 'Inter', sans-serif;`
- Song titles: `font-family: 'Noto Sans Devanagari', sans-serif;` (for Hindi support)

### Animations
- Cassette spin: `animation: spin 4s linear infinite` (pauses when paused)
- City badge: `animation: fadeSlideUp 0.8s ease-out`
- Crossfade: `transition: opacity 1.5s ease-in-out`
- Fare meter tick: `animation: pulse 2s ease-in-out infinite`

---

## 10. Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/rickshaw_radio"

# Redis
REDIS_URL="redis://localhost:6379"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
APP_SECRET="your-super-secret-key"
SALT="visitor-hash-salt"

# Admin
ADMIN_USERNAME="admin"
ADMIN_PASSWORD_HASH="$2b$10$..." # bcrypt

# Optional: IP Geolocation
IPGEO_API_KEY=""

# Optional: CDN
CDN_URL=""
```

---

## 11. Deployment

### Docker Compose
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file: .env
    depends_on:
      - db
      - redis
  db:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: rickshaw_radio
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
volumes:
  postgres_data:
  redis_data:
```

### Build Notes
- Videos and songs should NOT be in Git. Use volume mounts or CDN.
- `public/videos/` and `public/songs/` should be `.gitignore`d.
- Provide a `scripts/seed.ts` for initial songs and videos metadata.

---

## 12. Security Considerations

- Rate limiting: 100 req/min per IP, 10 req/min for requests/votes
- Admin routes protected by middleware
- File uploads: Validate MIME type, size limit (audio: 20MB, video: 100MB)
- Fingerprint + IP hashing prevents easy spoofing of visitor counts
- Socket.io rooms prevent unauthorized ride access
- SQL injection prevented by Prisma ORM
- XSS prevention by React's built-in escaping

---

## 13. Future Enhancements (Post-MVP)

- **Radio Jockey Mode:** Scheduled "shows" where a host narrates auto stories
- **Weather Sync:** Match video weather to user's local weather
- **Hindi/English Toggle:** Full i18n support
- **Mobile App:** React Native wrapper
- **AI DJ:** Gemini/Claude integration for auto-generated ride commentary
- **NFT Tickets:** Blockchain-verified "ride tickets" as collectibles
- **Driver Stories:** Community-submitted auto driver anecdotes

---

## 14. Acceptance Criteria

- [ ] Videos loop seamlessly with crossfade
- [ ] Music player plays songs from `/songs/` folder
- [ ] Fare meter progresses accurately with song
- [ ] Auto Share creates rides with 6-digit codes
- [ ] Shared rides synchronize playback across passengers
- [ ] Live user count updates in real-time
- [ ] Song requests can be submitted and upvoted
- [ ] Admin dashboard shows all analytics
- [ ] Mobile responsive (portrait video crop)
- [ ] Analytics accurately track unique visitors (IP + fingerprint)
- [ ] Page load time < 2s on 4G
- [ ] Supports 100 concurrent users without degradation

---

*End of PRD*
