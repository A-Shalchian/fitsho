# Fitsho - Sprint Tracker

## Current Sprint: UI Foundation & Core Workout Flow

### Completed
- [x] Project setup (Next.js 16, Convex, Clerk, Tailwind)
- [x] Authentication (sign-in, sign-up, protected routes)
- [x] User sync to database on login
- [x] Basic database schema (users, exercises, workouts, sets, supplements)
- [x] Weight unit preference (kg/lbs toggle)
- [x] UI Design system (dark theme, grid background, minimal aesthetic)
- [x] Landing page with animated grid background
- [x] AppShell component (shared nav layout)
- [x] Dashboard page (greeting, weekly calendar placeholder)
- [x] Profile page (professional UI with avatar, sections, light gradient buttons)
- [x] Workout page (start/finish workout shell)
- [x] Exercise library seeding (ExerciseDB API integration with filters)
- [x] Exercise library page (/exercises) with card grid
- [x] Exercise cards with lazy-loaded GIFs
- [x] Exercise detail modal (GIF, instructions, muscles)
- [x] Pagination (load more)
- [x] Sorting (name, muscle group, equipment)
- [x] Custom scrollbar styling
- [x] Filter by muscle group
- [x] Filter by equipment
- [x] Exercise picker with search (for workout flow)
- [x] Set logging UI (weight, reps, warmup toggle)
- [x] New workout flow (local state until finish)
- [x] Dark/light mode toggle with system preference support

### In Progress
- [ ] Calendar component (month view)
- [ ] Workout day highlighting on calendar
- [ ] Day detail view

### Up Next
- [ ] Show last session's performance for exercise
- [ ] Workout timer/duration display

---

## Backlog

### Phase 2: Calendar Home
- [ ] Monthly calendar component
- [ ] Visual indicator for workout days
- [ ] Today card with quick actions
- [ ] Tap day to see workout summary
- [ ] Streak tracking display

### Phase 3: Exercise Library
- [x] Seed exercise database (ExerciseDB API - 1300+ exercises with GIFs)
- [x] Exercise library page with cards
- [x] Sorting by name/muscle/equipment
- [x] Filter by muscle group
- [x] Filter by equipment
- [x] Search functionality (in workout exercise picker)
- [ ] Custom exercise creation

### Phase 4: Workout Tracking (Core)
- [x] Start workout flow
- [x] Add exercise to active workout (exercise picker modal)
- [x] Set-by-set logging UI (weight, reps)
- [ ] Show last session's performance for exercise
- [x] Warmup set toggle
- [ ] Workout notes
- [x] Complete workout flow
- [ ] Workout timer/duration display
- [ ] RPE input

### Phase 5: Supplements
- [ ] Supplement list management (add/remove/reorder)
- [ ] Daily supplement checklist on home
- [ ] Supplement history per day
- [ ] Quick toggle from calendar view

### Phase 6: Polish & History
- [ ] Exercise history view (past performances)
- [ ] Progress charts (weight over time)
- [ ] Workout history list
- [ ] Edit past workouts
- [ ] Data export

---

## Future Features (Post-MVP)

### AI Recommendations
- Suggest weight increases based on performance
- Detect plateaus and suggest changes
- Rep/set recommendations
- Rest time suggestions

### Social
- Share workouts
- Public profiles
- Workout templates sharing

### Advanced Tracking
- Body measurements
- Progress photos
- Body weight logging
- Macro tracking integration

### Gamification
- Achievements/badges
- PR celebrations
- Streak rewards
- Weekly challenges

### Integrations
- Apple Health sync
- Google Fit sync
- Workout plan import
- Export to spreadsheet

---

## Design Notes

### UI Style
- Dark/light mode with system preference support
- Grid background with purple glow (animated on landing)
- Minimal, utilitarian aesthetic
- Single accent color (purple #7c3aed)
- Flat cards with thin borders (#1a1a1a)
- Geist font family
- Light gradients on active/selected buttons (white to gray on dark bg)
- Pill-shaped primary buttons, rounded-xl cards

### Component Patterns
- AppShell for all authenticated pages
- Cards: bg-surface, border-border, rounded-xl
- Buttons: light gradient for active states on dark bg
- Destructive buttons: red tints at 10-20% opacity
- Section headers: uppercase, small, muted, tracking-wider
- Text: foreground for headings, muted for secondary
- Active nav links highlighted
- Custom scrollbar (thin, dark)

---

## Bug Fixes & Tech Debt
- [ ] Middleware deprecation warning (switch to proxy)
- [ ] Add loading states for data fetching
- [ ] Add error boundaries
- [ ] Mobile responsive testing
- [ ] Accessibility audit

---

## Session Notes

### 2026-01-27
- Created UI design system with grid background
- Built landing page, dashboard, profile, workout pages
- Implemented AppShell for consistent navigation
- All pages now have cohesive dark minimal design

### 2026-01-28
- Integrated ExerciseDB API for exercise seeding
- Added filters (equipment, bodyPart, target) and limit params to seed function
- Built /exercises page with responsive card grid
- Added lazy loading for exercise GIFs
- Added exercise detail modal with instructions
- Implemented pagination (load more button)
- Added sorting dropdown (name, muscle group, equipment)
- Redesigned profile page (professional layout, avatar, sections)
- Added light gradient buttons for selected states
- Custom scrollbar styling throughout app
- Added muscle group filter (server-side with index)
- Added equipment filter (client-side on results)
- Filter bar UI with dropdowns and clear button
- Empty state for no results
- Rebuilt workout flow: workout stays in local state until finish
- Added exercise picker with muscle group filter and search
- Added set logging UI with weight, reps, warmup toggle
- Added saveWorkout mutation to save entire workout at once
- Flow: Start → Pick Exercise → Log Sets → Next Exercise or Finish

### 2026-01-29
- Added dark/light mode with system preference detection
- Theme toggle button in header (cycles: dark → light → system)
- CSS variables for both themes, localStorage persistence
