# Bokmål App — Visual Style Brief

## Purpose
This file defines the visual style only: colours, fonts, shapes, spacing, and general interface feel.

It does not define app features, data structure, grammar content, or exercises.

## Colour Palette

### Hex Codes

```text
#d6c1c0  soft warm pink-grey
#53898b  muted teal
#396573  blue-teal
#154f61  deep teal-blue
#092853  dark navy
```

## Colour Usage

### Backgrounds

```css
--color-page-bg: #d6c1c0;
--color-card-bg: #f7f1ef;
--color-soft-panel: #eadada;
```

Use `#d6c1c0` lightly, preferably as a soft background tint or subtle gradient rather than a strong solid background.

### Text

```css
--color-text-main: #092853;
--color-text-muted: #396573;
--color-text-inverse: #ffffff;
```

Use `#092853` for main headings and important text.

### Buttons and Actions

```css
--color-primary: #092853;
--color-primary-hover: #154f61;
--color-secondary: #396573;
--color-accent: #53898b;
```

Primary buttons should usually use dark navy or deep teal-blue.

### Progress and Success

```css
--color-success: #53898b;
--color-progress: #53898b;
```

Use muted teal for progress, completion, and positive states.

## Typography

Preferred font pairing:

```text
Headings: Gloock
Body/UI: Inter
```

### CSS Font Rules

```css
body {
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

h1,
h2,
.display-title {
  font-family: 'Gloock', Georgia, serif;
}
```

## Typography Usage

### Gloock
Use for:
- main page headings
- hero titles
- occasional large display text

Do not use Gloock for long paragraphs, forms, buttons, or dense learning content.

### Inter
Use for:
- body text
- navigation
- buttons
- forms
- flashcards
- tests
- German prompts
- Bokmål answers

## Shapes

### Border Radius

```css
--radius-sm: 10px;
--radius-md: 16px;
--radius-lg: 24px;
--radius-xl: 32px;
--radius-pill: 999px;
```

Use rounded cards and buttons throughout the app.

Recommended use:
- Small labels/badges: `10px` or pill
- Buttons: `16px` or pill
- Cards: `24px`
- Large practice panels: `32px`

## Cards

Cards should feel soft, calm, and spacious.

```css
.card {
  background: #f7f1ef;
  border-radius: 24px;
  box-shadow: 0 18px 45px rgba(9, 40, 83, 0.12);
}
```

## Buttons

Buttons should be large, rounded, and easy to press.

```css
.button-primary {
  background: #092853;
  color: #ffffff;
  border-radius: 999px;
}

.button-secondary {
  background: transparent;
  color: #092853;
  border: 1px solid #396573;
  border-radius: 999px;
}
```

## Inputs

Input fields should be rounded, readable, and calm.

```css
.input {
  background: #ffffff;
  border: 1px solid rgba(57, 101, 115, 0.35);
  border-radius: 16px;
  color: #092853;
}
```

## Spacing

Use generous spacing.

```css
--space-xs: 0.25rem;
--space-sm: 0.5rem;
--space-md: 1rem;
--space-lg: 1.5rem;
--space-xl: 2rem;
--space-2xl: 3rem;
```

The app should not feel cramped.

## Visual Feel

The app should feel:

- calm
- modern
- adult
- warm
- spacious
- uncluttered
- focused on practice

It should not feel:

- childish
- cartoonish
- over-gamified
- cluttered
- visually noisy

## Design Summary

```text
Muted Nordic-inspired palette.
Rounded cards.
Large calm practice areas.
Dark navy text.
Teal progress accents.
Gloock headings.
Inter interface text.
No clutter.
```

