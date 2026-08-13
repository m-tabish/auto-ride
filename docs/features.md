# Rickshaw Radio - Features List

## Tech Stack & Core Libraries
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v4, `tw-animate-css`
- **UI Components & Icons**: `shadcn/ui`, `@base-ui/react`, `@phosphor-icons/react`
- **Real-time / State (MVP/Post-MVP)**: Socket.io, Redis, Prisma (PostgreSQL)
- **Internationalization**: `next-intl` (All UI components to be kept i18n compliant for easy Hindi/English toggling)

## MVP Features (Currently Working On)
- **Background Video Loop**: Full-screen looping videos of auto-rickshaw POV rides with seamless crossfade and city badges.
- **Music Player**: Minimal bottom bar player with fare-meter styled progress, play/pause, prev/next, volume control, and spinning cassette animation.
- **i18n Compliant UI Layout**: Initial shell built using Phosphor icons and Tailwind CSS, fully prepared for i18n translation keys.
- **Simple Room-based Auto Share (Ride Sharing)**: 
  - Users can start a ride and set start location, destination, and travel time.
  - A temporary 6-digit room code is generated for each ride.
  - **No Authentication Required**: Anyone can join easily by simply entering the room code or using a shareable link.
  - Synchronized song playback across passengers and a basic passenger avatar list.
- **Song Request System (Basic)**: Users can request songs via a simple form.

## Complex / Post-MVP Features (To be implemented later)
- **Comprehensive Analytics & Tracking**: Live listener count via Socket.io/Redis, IP/fingerprint deduplication, session metrics, and detailed song analytics.
- **Admin Dashboard & Authentication**: Full secure admin auth, analytics viewing, request moderation, and file uploading.
- **Advanced Real-Time Features**: Radio Jockey mode, AI DJ, and local weather synchronization.
- **Mobile App & Internationalization**: React Native app wrapper, Hindi/English language toggle.
- **Advanced Geolocation**: IP-based country/city geographic data tracking.
