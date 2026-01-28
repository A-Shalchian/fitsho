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
- [x] Profile page (email display, weight unit toggle, sign out)
- [x] Workout page (start/finish workout shell)

### In Progress
- [ ] Exercise library seeding
- [ ] Exercise picker with muscle group filter
- [ ] Set logging UI

### Up Next
- [ ] Calendar component (month view)
- [ ] Workout day highlighting on calendar
- [ ] Day detail view

---

## Backlog

### Phase 2: Calendar Home
- [ ] Monthly calendar component
- [ ] Visual indicator for workout days
- [ ] Today card with quick actions
- [ ] Tap day to see workout summary
- [ ] Streak tracking display

### Phase 3: Exercise Library
- [ ] Seed exercise database (40+ exercises)
- [ ] Exercise picker modal
- [ ] Filter by muscle group
- [ ] Search functionality
- [ ] Custom exercise creation

### Phase 4: Workout Tracking (Core)
- [ ] Start workout flow
- [ ] Add exercise to active workout
- [ ] Set-by-set logging UI (weight, reps, RPE)
- [ ] Show last session's performance for exercise
- [ ] Warmup set toggle
- [ ] Workout notes
- [ ] Complete workout flow
- [ ] Workout timer/duration display

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
- Dark mode only (#050505 background)
- Grid background with purple glow (animated on landing)
- Minimal, utilitarian aesthetic
- Single accent color (purple #7c3aed)
- Flat cards with thin borders (#1a1a1a)
- Geist font family
- No gradients on UI elements
- Pill-shaped primary buttons, rounded-lg secondary

### Component Patterns
- AppShell for all authenticated pages
- Cards: bg-surface, border-border, rounded-lg
- Buttons: foreground bg for primary, border-only for secondary
- Text: foreground for headings, muted for secondary
- Active nav links highlighted

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
