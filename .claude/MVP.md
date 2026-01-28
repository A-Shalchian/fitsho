# Fitsho MVP - Fitness Tracker

## Tech Stack
- **Frontend**: Next.js 16 (App Router)
- **Backend/Database**: Convex
- **Auth**: Clerk
- **Styling**: Tailwind CSS

---

## MVP Core Features

### 1. Authentication (Clerk)
- Sign up / Sign in
- User profile management
- Protected routes

### 2. Calendar View (Home)
- Monthly calendar showing gym days
- Visual indicator for days worked out
- Tap day to see workout summary
- Track streaks and consistency

### 3. Workout Tracking (Core Flow)
- Quick "Start Workout" from today's date
- Pick exercise from list (filtered by muscle group)
- Log sets ONE BY ONE as you do them:
  - Enter weight
  - Enter reps
  - (Optional) RPE
  - Save -> ready for next set
- See previous performance for that exercise (last time's weight/reps)
- Add another exercise when ready
- End workout when done

### 4. Exercise Library
- Pre-populated exercise database
- Filter by muscle group (chest, triceps, etc.)
- Search exercises
- Custom exercise creation

### 5. Supplements Tracking
- Daily supplement checklist
- Track: protein, creatine, vitamins, etc.
- Simple yes/no per day
- See supplement history on calendar

### 6. Progress & Recommendations (Future)
- View exercise history (weight/reps over time)
- Data collected for future AI recommendations:
  - Suggest weight increase
  - Suggest more sets
  - Track progressive overload

---

## Database Schema (Convex)

### Tables

```typescript
// users - synced from Clerk
users: {
  clerkId: string,          // Clerk user ID
  email: string,
  name: string,
  createdAt: number,
  weightUnit: "kg" | "lbs", // user preference
}

// exercises - exercise library
exercises: {
  name: string,
  muscleGroup: string,      // "chest", "back", "legs", etc.
  equipment: string,        // "barbell", "dumbbell", "machine", "bodyweight"
  isCustom: boolean,
  userId?: string,          // only if custom exercise
}

// workouts - workout sessions
workouts: {
  userId: string,
  name: string,             // "Push Day", "Leg Day", etc.
  startedAt: number,
  completedAt?: number,
  notes?: string,
}

// workoutExercises - exercises within a workout
workoutExercises: {
  workoutId: Id<"workouts">,
  exerciseId: Id<"exercises">,
  order: number,
}

// sets - individual sets logged
sets: {
  workoutExerciseId: Id<"workoutExercises">,
  setNumber: number,
  weight: number,
  reps: number,
  rpe?: number,             // 1-10 rate of perceived exertion
  isWarmup: boolean,
  completedAt: number,
}

// supplements - user's supplement list
supplements: {
  userId: string,
  name: string,             // "Protein", "Creatine", "Vitamin D"
  order: number,
}

// supplementLogs - daily supplement tracking
supplementLogs: {
  userId: string,
  supplementId: Id<"supplements">,
  date: string,             // "2024-01-27" format for easy querying
  taken: boolean,
}
```

---

## App Structure

```
app/
├── (auth)/
│   ├── sign-in/[[...sign-in]]/page.tsx
│   └── sign-up/[[...sign-up]]/page.tsx
├── (main)/
│   ├── layout.tsx          # main app layout with bottom nav
│   ├── page.tsx            # calendar home
│   ├── day/
│   │   └── [date]/page.tsx # specific day view (workout + supplements)
│   ├── workout/
│   │   ├── page.tsx        # active workout (redirect if none)
│   │   ├── active/page.tsx # current workout session
│   │   └── [id]/page.tsx   # view past workout
│   ├── exercises/
│   │   └── page.tsx        # exercise library/browser
│   ├── supplements/
│   │   └── page.tsx        # manage supplement list
│   └── profile/
│       └── page.tsx        # user settings
├── layout.tsx              # root layout (providers)
└── page.tsx                # landing page (unauthenticated)

convex/
├── schema.ts               # database schema
├── users.ts                # user mutations/queries
├── exercises.ts            # exercise library
├── workouts.ts             # workout CRUD
├── workoutExercises.ts     # exercises in workout
├── sets.ts                 # set logging
├── supplements.ts          # supplement definitions
└── supplementLogs.ts       # daily supplement tracking

components/
├── ui/                     # base UI components
├── calendar/
│   ├── Calendar.tsx        # month view
│   ├── DayCell.tsx         # individual day
│   └── TodayCard.tsx       # today's quick actions
├── workout/
│   ├── ActiveWorkout.tsx   # current session
│   ├── ExercisePicker.tsx  # pick exercise with filters
│   ├── SetLogger.tsx       # log single set
│   ├── SetList.tsx         # sets done for exercise
│   └── LastPerformance.tsx # show previous stats
├── supplements/
│   ├── SupplementChecklist.tsx
│   └── SupplementItem.tsx
└── layout/
    └── BottomNav.tsx       # mobile navigation (Home, Workout, Profile)
```

---

## MVP User Flows

### Flow 1: Daily View (Home)
1. Open app -> see calendar with current month
2. Days with workouts are highlighted
3. Today is prominent with quick actions
4. Tap any day to see that day's workout + supplements

### Flow 2: Start Workout (The Gym Flow)
1. Tap "Start Workout" on today
2. See exercise picker (filter by muscle group: Chest, Triceps, etc.)
3. Tap exercise (e.g., "Bench Press")
4. See last session's stats for this exercise (motivational)
5. **Log Set 1**: Enter weight -> Enter reps -> Save
6. **Log Set 2**: Enter weight -> Enter reps -> Save
7. (Repeat until done with exercise)
8. Tap "Add Exercise" -> pick next exercise
9. Repeat logging sets
10. Tap "Finish Workout" when done

### Flow 3: Log Supplements
1. On home screen, see today's supplement checklist
2. Tap to check off: Protein, Creatine, etc.
3. Simple toggle - did you take it or not
4. Persists per day

### Flow 4: View Progress
1. Tap on a past day in calendar
2. See full workout: exercises + all sets
3. Tap exercise to see history graph (future)
4. Compare to current performance

---

## Implementation Order

### Phase 1: Foundation
- [ ] Install Convex + Clerk
- [ ] Setup Convex schema
- [ ] Configure Clerk with Convex
- [ ] Create basic layout with bottom navigation

### Phase 2: Calendar Home
- [ ] Calendar component (month view)
- [ ] Show workout days highlighted
- [ ] Today's quick actions
- [ ] Day detail view

### Phase 3: Exercise Library
- [ ] Seed exercise database
- [ ] Exercise picker with muscle group filter
- [ ] Search functionality

### Phase 4: Workout Tracking (Core)
- [ ] Start workout flow
- [ ] Exercise selection during workout
- [ ] Set-by-set logging UI
- [ ] Show last session's performance
- [ ] Complete workout

### Phase 5: Supplements
- [ ] Supplement list management
- [ ] Daily supplement checklist
- [ ] Supplement history per day

### Phase 6: Polish & Data
- [ ] User preferences (weight unit)
- [ ] Custom exercises
- [ ] Exercise history view
- [ ] Data export (for future AI training)

---

## Seed Data - Muscle Groups & Exercises

```typescript
const muscleGroups = [
  "chest",
  "back",
  "shoulders",
  "biceps",
  "triceps",
  "legs",
  "glutes",
  "core",
  "forearms",
  "calves",
]

const seedExercises = [
  // Chest
  { name: "Bench Press", muscleGroup: "chest", equipment: "barbell" },
  { name: "Incline Bench Press", muscleGroup: "chest", equipment: "barbell" },
  { name: "Dumbbell Fly", muscleGroup: "chest", equipment: "dumbbell" },
  { name: "Push Up", muscleGroup: "chest", equipment: "bodyweight" },
  { name: "Cable Crossover", muscleGroup: "chest", equipment: "cable" },

  // Back
  { name: "Deadlift", muscleGroup: "back", equipment: "barbell" },
  { name: "Barbell Row", muscleGroup: "back", equipment: "barbell" },
  { name: "Pull Up", muscleGroup: "back", equipment: "bodyweight" },
  { name: "Lat Pulldown", muscleGroup: "back", equipment: "cable" },
  { name: "Seated Row", muscleGroup: "back", equipment: "cable" },

  // Shoulders
  { name: "Overhead Press", muscleGroup: "shoulders", equipment: "barbell" },
  { name: "Lateral Raise", muscleGroup: "shoulders", equipment: "dumbbell" },
  { name: "Face Pull", muscleGroup: "shoulders", equipment: "cable" },
  { name: "Arnold Press", muscleGroup: "shoulders", equipment: "dumbbell" },

  // Biceps
  { name: "Barbell Curl", muscleGroup: "biceps", equipment: "barbell" },
  { name: "Dumbbell Curl", muscleGroup: "biceps", equipment: "dumbbell" },
  { name: "Hammer Curl", muscleGroup: "biceps", equipment: "dumbbell" },
  { name: "Preacher Curl", muscleGroup: "biceps", equipment: "machine" },

  // Triceps
  { name: "Tricep Pushdown", muscleGroup: "triceps", equipment: "cable" },
  { name: "Skull Crusher", muscleGroup: "triceps", equipment: "barbell" },
  { name: "Tricep Dip", muscleGroup: "triceps", equipment: "bodyweight" },
  { name: "Overhead Tricep Extension", muscleGroup: "triceps", equipment: "dumbbell" },

  // Legs
  { name: "Squat", muscleGroup: "legs", equipment: "barbell" },
  { name: "Leg Press", muscleGroup: "legs", equipment: "machine" },
  { name: "Romanian Deadlift", muscleGroup: "legs", equipment: "barbell" },
  { name: "Leg Curl", muscleGroup: "legs", equipment: "machine" },
  { name: "Leg Extension", muscleGroup: "legs", equipment: "machine" },
  { name: "Lunges", muscleGroup: "legs", equipment: "bodyweight" },

  // Glutes
  { name: "Hip Thrust", muscleGroup: "glutes", equipment: "barbell" },
  { name: "Glute Bridge", muscleGroup: "glutes", equipment: "bodyweight" },
  { name: "Cable Kickback", muscleGroup: "glutes", equipment: "cable" },

  // Core
  { name: "Plank", muscleGroup: "core", equipment: "bodyweight" },
  { name: "Crunch", muscleGroup: "core", equipment: "bodyweight" },
  { name: "Hanging Leg Raise", muscleGroup: "core", equipment: "bodyweight" },
  { name: "Cable Woodchop", muscleGroup: "core", equipment: "cable" },

  // Calves
  { name: "Standing Calf Raise", muscleGroup: "calves", equipment: "machine" },
  { name: "Seated Calf Raise", muscleGroup: "calves", equipment: "machine" },
]
```

---

## Environment Variables Needed

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Convex
NEXT_PUBLIC_CONVEX_URL=
CONVEX_DEPLOY_KEY=
```

---

## Next Steps

1. Run `npx convex init` to setup Convex
2. Run `npm install @clerk/nextjs convex`
3. Setup Clerk account and get keys
4. Create schema and start building!
