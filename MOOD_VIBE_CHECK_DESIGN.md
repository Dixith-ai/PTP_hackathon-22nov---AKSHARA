# Mood & Vibe Check-In Page - Design & Implementation

## 🎨 Full Page Design Explanation

### Layout Structure

The page follows a **progressive disclosure pattern** with 4 main sections that appear sequentially:

1. **Mood Selection** (Always visible)
2. **Vibe Selection** (Appears after mood selection)
3. **Time Selection** (Appears after vibe selection)
4. **Subject Selection** (Optional, appears after time selection)
5. **Generate Button** (Appears when all required fields are selected)
6. **Generated Plan Display** (Appears after generation)

### Component Arrangement

#### Header Section
- **Animated DoodleStar** (rotating star icon)
- **Gradient Title** (pink → purple → cyan gradient)
- **Warm microcopy** explaining the purpose

#### Step 1: Mood Selection
- **6 Mood Cards** in a responsive grid (2 cols mobile, 3 cols tablet, 6 cols desktop)
- Each card features:
  - Large emoji (5xl size)
  - Mood label (bold, large text)
  - Description text (small, gray)
  - Color-coded borders and backgrounds when selected
  - Hover animations (scale + lift)

#### Step 2: Vibe Selection
- **5 Vibe Cards** in a responsive grid
- Each card features:
  - Icon (Lucide icon)
  - Vibe label
  - Description
  - Intensity badge
  - Glowing background animation when selected
  - Hover effects

#### Step 3: Time Selection
- **5 Time Chips** in a horizontal flex layout
- Large, bold buttons (15m, 30m, 1h, 1.5h, 3h)
- Selected state with blue glow

#### Step 4: Subject Selection (Optional)
- **Multi-select chips** in a flex wrap layout
- 12 predefined subjects
- Toggle selection with visual feedback

#### Generate Button
- **Full-width, large button** with icon
- Loading state with animated spinner
- Disabled when requirements not met

#### Generated Plan Card
- **Warm summary** in a highlighted box
- **Stats grid** (5 cards: Lessons, Intensity, Practice, Breaks, Total Time)
- **Schedule list** with time blocks
- **Action buttons** (Start Learning, Create New Plan)

### Motion & Micro-interactions

1. **Page Load**: Fade in + slide up animation
2. **Section Appearance**: Sequential fade-in with stagger delay
3. **Card Hover**: Scale (1.05) + lift (-4px)
4. **Card Tap**: Scale down (0.95) for tactile feedback
5. **Selection**: Border color change + background glow + shadow
6. **Plan Generation**: Scale + fade in with spring animation
7. **Schedule Items**: Staggered slide-in from left
8. **DoodleStar**: Continuous rotation (20s loop)

### Glow Accents

- **Selected mood cards**: Colored border + background glow + shadow
- **Selected vibe cards**: Colored border + animated background pulse
- **Generate button**: Primary neon pink glow
- **Plan card**: Pink glow border
- **Stats cards**: Individual colored glows

### Doodles & Icons

- **DoodleStar**: Rotating star in header
- **DoodleHeart**: In mood section header
- **DoodleSparkle**: In generate button (loading state)
- **Lucide Icons**: Brain, Zap, Coffee, Target, Palette, FileText, BookOpen, Clock, CheckCircle2, Sparkles

### Warm Microcopy

- Header: "Tell us how you're feeling and what you want to achieve today. We'll create a personalized study plan just for you! ✨"
- Mood descriptions: "Peaceful and relaxed", "Low energy, need rest", etc.
- Vibe descriptions: "Intensive learning sessions", "Short, achievable tasks", etc.
- Generated plan summary: Personalized warm messages based on selections

### Flow for Selecting

1. User selects **mood** → Vibe section appears
2. User selects **vibe** → Time section appears
3. User selects **time** → Subject section appears (optional)
4. User can select **subjects** (optional, multi-select)
5. User clicks **"Generate Today's Plan"** → Plan appears

### Final "Generate Today's Plan" Button

- **Large, prominent button** (xl text, py-6 padding)
- **Icon + text** (Sparkles icon + "Generate Today's Plan")
- **Loading state**: Animated DoodleSparkle + "Generating Your Plan..."
- **Disabled state**: When mood, vibe, or time not selected
- **Full width** for maximum visibility

### Resulting Plan Card

The generated plan includes:

1. **Warm Summary Box**
   - Highlighted background (pink/10)
   - Border (pink/30)
   - Personalized message based on selections

2. **Stats Grid** (5 cards)
   - Lessons count (pink)
   - Intensity level (purple)
   - Practice tasks (blue)
   - Breaks count (cyan)
   - Total time (green)

3. **Schedule Block List**
   - Time stamps (mono font, cyan)
   - Activity names
   - Duration badges
   - Color-coded by type (lesson = blue, break = purple)
   - Staggered animations

4. **Action Buttons**
   - "Start Learning" (primary, full width)
   - "Create New Plan" (secondary)

---

## 💻 Full Front-End Implementation

### Page File
- **Location**: `app/mood-vibe-check/page.tsx`
- **Type**: Client component ('use client')
- **Framework**: Next.js 14 App Router

### React Component Structure

```typescript
MoodVibeCheckPage (Main Component)
├── Layout (Wrapper)
├── Header Section
│   ├── Animated DoodleStar
│   ├── Gradient Title
│   └── Description
├── Step 1: Mood Selection
│   └── 6 Mood Cards (Grid)
├── Step 2: Vibe Selection (AnimatePresence)
│   └── 5 Vibe Cards (Grid)
├── Step 3: Time Selection (AnimatePresence)
│   └── 5 Time Chips (Flex)
├── Step 4: Subject Selection (AnimatePresence)
│   └── 12 Subject Chips (Flex Wrap)
├── Generate Button (AnimatePresence)
└── Generated Plan (AnimatePresence)
    ├── Summary Box
    ├── Stats Grid
    ├── Schedule List
    └── Action Buttons
```

### State Handling

```typescript
const [selectedMood, setSelectedMood] = useState<string | null>(null)
const [selectedVibe, setSelectedVibe] = useState<string | null>(null)
const [selectedTime, setSelectedTime] = useState<number | null>(null)
const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
const [plan, setPlan] = useState<StudyPlan | null>(null)
const [isGenerating, setIsGenerating] = useState(false)
```

### UI Components Used

1. **Card**: Custom card component with glow effects
2. **Button**: Custom button with variants
3. **Badge**: Custom badge for intensity labels
4. **Doodle Components**: DoodleStar, DoodleHeart, DoodleSparkle
5. **Lucide Icons**: Various icons for moods and vibes

### Animation Cues

- **Framer Motion** for all animations
- **AnimatePresence** for conditional rendering animations
- **Stagger delays** for sequential item appearances
- **Spring animations** for plan generation
- **Hover/tap animations** for interactive elements

### Rendering the Study Schedule

The schedule is generated algorithmically based on:
- Selected mood (affects lesson count, intensity, breaks)
- Selected vibe (adjusts lesson types and practice count)
- Selected time (total duration)
- Selected subjects (appears in schedule items)

Each schedule item includes:
- Time stamp (formatted as HH:MM)
- Activity name
- Duration badge
- Type-based styling (lesson vs break)

---

## 📊 Output of Generated Plan

### Always Included:

1. **Warm Summary**
   - Personalized message based on mood + vibe + time
   - 3 different message templates (randomly selected)
   - Example: "Perfect! Based on your energetic mood and deep focus vibe, we've crafted a high intensity plan that fits your 60-minute window."

2. **Number of Lessons**
   - Calculated based on mood and time
   - Range: 1-12 lessons depending on selections
   - Formula: `Math.ceil(totalMinutes / lessonDuration)`

3. **Suggested Intensity**
   - Values: "Low", "Medium", "High", "Low-Medium", "Medium-High", "Medium-Low"
   - Determined by mood and vibe combination

4. **Practice / Tests Count**
   - Calculated as percentage of lessons
   - Range: 0.2x to 1.2x lessons depending on vibe
   - Example: Review & Tests vibe = 1.2x lessons

5. **Suggested Breaks**
   - Calculated based on mood and total time
   - Range: 1-6 breaks
   - Formula: `Math.ceil(totalMinutes / breakInterval)`

6. **Simple Schedule Block List**
   - Alternating lesson and break blocks
   - Each block includes:
     - Time (HH:MM format)
     - Activity name
     - Duration
     - Type (lesson/break)
   - Limited to 8 items for readability
   - Color-coded (blue for lessons, purple for breaks)

### Generation Logic (Client-Side Only)

All calculations are done client-side using:
- Mood-based algorithms (different lesson durations per mood)
- Vibe-based adjustments (intensity and practice count)
- Time-based distribution (evenly spread across available time)
- Subject integration (appears in lesson names if selected)

No backend required - everything runs in the browser!

---

## 🎯 Key Features

✅ **Progressive Disclosure**: Sections appear as user progresses  
✅ **Smooth Animations**: Framer Motion for all transitions  
✅ **Responsive Design**: Works on all screen sizes  
✅ **Accessibility**: Clear labels, keyboard navigation  
✅ **Visual Feedback**: Hover states, selections, loading states  
✅ **Client-Side Only**: No backend required  
✅ **Personalized Output**: Plan adapts to all selections  

---

## 🚀 Usage

Navigate to `/mood-vibe-check` to access the page. The page is fully functional and ready to use!

