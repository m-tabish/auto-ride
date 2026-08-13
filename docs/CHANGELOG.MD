# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
- **Changed**: Improved Focus Mode animation. The main "बस ड्राइवर" title now smoothly scales down and anchors to the top center of the screen when Focus Mode is activated, while the rest of the HUD fades out.
- **Changed**: Synchronized the background video playback with the Music Player. Playing or pausing the music will now identically play or pause the background video to keep the experience aligned.
- **Added**: Implemented global keyboard shortcuts for the Music Player (`Space` for Play/Pause, `ArrowLeft` & `ArrowRight` for seeking).
- **Changed**: Adjusted the HUD layout to center the main title perfectly, and shifted the `RideSidebar` slightly more inward for better padding.
- **Added**: Implemented "Focus Mode" in the main layout (`app/page.tsx`). Users can click an eye icon in the bottom right to completely fade out the HUD (Music Player, Titles, Sidebar) to enjoy the background video without distractions. Moving the mouse over the screen temporarily brings the UI back.
- **Changed**: Modified `RideSidebar` to be collapsible. It now collapses into a subtle circular "Users" icon to save screen real estate.
- **Added**: Linked real video and song assets from the local project files. The background now plays `video.mp4` on loop, and the music player streams a local MP3 file directly when the Play button is pressed.
- **Added**: Implemented `RideSidebar` component to display the active room code and live passengers, providing an easy way to invite friends into the shared auto experience.
- **Added**: Implemented the core UI Layout (`app/page.tsx`) and the Music Player component (`components/player/MusicPlayer.tsx`) based on the reference design, utilizing `@phosphor-icons/react` and Tailwind CSS.
- **Added**: Included a "Tech Stack & Packages" section in `features.md` detailing the libraries in use (`next-intl`, `@phosphor-icons/react`, `tw-animate-css`, etc.).
- **Added**: Initialized `features.md` with a breakdown of MVP and Post-MVP features based on the `Rickshaw_Radio_PRD.md`.
- **Changed**: Adjusted the main page layout to accommodate a floating right-side panel for shared ride participants.
- **Changed**: Prioritized a simple "Auto Share" room system for the MVP. Rides generate temporary 6-digit room codes, allowing users to join easily without any login or authentication required.
- **Changed**: Adopted a strict i18n-compliant approach for all UI development from the start to support future Hindi/English toggling.
