# PROJECT SELF-ASSESSMENT RUBRIC

**Student:** Truong Minh Thanh  
**ID:** 524H0032  
**Deployment URL:** https://note-management-app.onrender.com/ 

This document outlines the self-assessment for the 28 required features of the Note Management Application.

| No. | Criterion (Feature) | Status | Technical Notes |
|:---:|:---|:---:|:---|
| 1 | User registration | ✅ Done | Validation, bcrypt hashing, auto-login after creation. |
| 2 | Account activation | ✅ Done | Activation link via Email. Warning banner for unverified users. |
| 3 | User login & logout | ✅ Done | JWT-based auth with Route Guards for Dashboard protection. |
| 4 | Password reset | ✅ Done | OTP via Email. Secure 2-step password reset flow. |
| 5 | View profile & avatar | ✅ Done | Cloudinary integration for real-world image storage. |
| 6 | Edit profile & avatar | ✅ Done | Synchronized updates for display name and avatar. |
| 7 | Change password | ✅ Done | Old password verification before updating to new password. |
| 8 | User preferences | ✅ Done | Font-size adjustments, Dark/Light mode, Note colors (12 presets). |
| 9 | Display notes list view | ✅ Done | Seamless toggle between Grid and List layouts. |
| 10 | Display notes grid view | ✅ Done | Modern Responsive Grid with optimized scaling. |
| 11 | Create notes | ✅ Done | Comprehensive metadata support (title, content, colors, labels). |
| 12 | Update notes | ✅ Done | Real-time content synchronization. |
| 13 | Delete notes | ✅ Done | Permanent deletion with Cloudinary image cleanup. |
| 14 | Auto-save notes | ✅ Done | Debounce logic (1000ms) with visual saving status. |
| 15 | Attach images to notes | ✅ Done | Multi-image upload support to Cloudinary arrays. |
| 16 | Pin notes to top | ✅ Done | "Sort by Pinned" logic ensures important notes stay at top. |
| 17 | Search notes | ✅ Done | Live Search filtering by both Title and Content. |
| 18 | Label management | ✅ Done | Full CRUD for labels (Add, Edit, Delete) via Sidebar. |
| 19 | Filter notes by labels | ✅ Done | Dynamic filtering via Sidebar with active state tracking. |
| 20 | Attach labels to notes | ✅ Done | Many-to-many relationship management between notes and labels. |
| 21 | Enable/Disable password | ✅ Done | Toggle-able encryption for sensitive information. |
| 22 | Password protected notes | ✅ Done | Secure verification modal for viewing/editing locked notes. |
| 23 | Share and receive notes | ✅ Done | Permission-based sharing (Read/Edit) + Copy to My Notes. |
| 24 | Collaboration & Real-time | ✅ Done | Laravel Reverb (WebSockets) for presence and instant sync. |
| 25 | UI and UX | ✅ Done | Premium glassmorphism design with responsive animations. |
| 26 | Responsive | ✅ Done | Fully optimized for Mobile, Tablet, and Desktop. |
| 27 | Offline Capabilities | ✅ Done | PWA Manifest + Intelligent LocalStorage caching. |
| 28 | Online deployment | ✅ Done | Deployed on Render with HTTPS and optimized performance. |

---
*Self-assessed by Truong Minh Thanh*
