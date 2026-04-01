# Vortex Background Variations

Here are 8 different color schemes for your login/signup pages. To switch between them:

1. Open `app/login/page.tsx` and `app/signup/page.tsx`
2. Comment out the current active Vortex component
3. Uncomment your preferred variation
4. Make sure both pages use the same variation for consistency

## Available Variations:

### 1. 🟢 Green Matrix Style (Current)
**Perfect for:** Tech/Coding/Hacker aesthetic
- `baseHue: 120` (Green)
- `particleCount: 500`
- Clean Matrix-like flowing green particles

### 2. 🟣 Purple Cyberpunk
**Perfect for:** Modern/Futuristic/Gaming feel
- `baseHue: 280` (Purple)
- `particleCount: 700`
- More particles, faster movement
- Dark purple/magenta vibes

### 3. 🔵 Blue Ocean
**Perfect for:** Professional/Calm/Corporate
- `baseHue: 200` (Blue)
- `particleCount: 600`
- Darker blue background (`#0a0f1e`)
- Slower, more fluid movement

### 4. 🩷 Pink/Magenta Dream
**Perfect for:** Creative/Design/Artistic apps
- `baseHue: 320` (Magenta/Pink)
- `particleCount: 500`
- Dark purple background (`#0d0011`)
- Energetic pink particle flow

### 5. 🟠 Orange Sunset
**Perfect for:** Warm/Energetic/Dynamic feel
- `baseHue: 30` (Orange)
- `particleCount: 600`
- Warm dark background (`#0a0604`)
- Golden/orange glow

### 6. 🩵 Cyan/Teal
**Perfect for:** Fresh/Modern/Clean aesthetic
- `baseHue: 180` (Cyan)
- `particleCount: 500`
- Dark teal background (`#000a0a`)
- Cool aqua particles

### 7. 🌈 Rainbow Spectrum
**Perfect for:** Playful/Colorful/Unique apps
- `baseHue: 0` (Full spectrum)
- `particleCount: 800`
- Most particles, fastest movement
- Multi-colored flowing effect

### 8. 🔴 Red Energy
**Perfect for:** Bold/Powerful/Intense feel
- `baseHue: 0` (Red)
- `particleCount: 500`
- Dark red background (`#0f0000`)
- Fiery red particle streams

## How to Switch:

Example: To change from Green to Purple Cyberpunk:

```tsx
// Comment out the current one:
{/* VARIATION 1: Green Matrix Style
<Vortex
  backgroundColor="black"
  rangeY={800}
  particleCount={500}
  baseHue={120}
  className="flex items-center flex-col justify-center px-2 md:px-10 w-full h-full"
>
*/}

// Uncomment your choice:
<Vortex
  backgroundColor="black"
  rangeY={1000}
  particleCount={700}
  baseHue={280}
  baseSpeed={0.1}
  rangeSpeed={2}
  className="flex items-center flex-col justify-center px-2 md:px-10 w-full h-full"
>
```

## Custom Parameters:

Want to create your own? Adjust these:
- `backgroundColor`: Hex color for background
- `baseHue`: 0-360 (color wheel: 0=red, 120=green, 240=blue)
- `particleCount`: Number of particles (300-1000)
- `baseSpeed`: Starting speed (0.0-0.2)
- `rangeSpeed`: Speed variation (1.0-3.0)
- `rangeY`: Vertical spread (500-1200)

Experiment and find your perfect look! 🎨
