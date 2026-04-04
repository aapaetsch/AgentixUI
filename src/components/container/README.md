# Container

A responsive layout wrapper for page content that provides consistent max-width constraints, padding, and optional centering following Material Design 3 layout guidelines.

## Installation

The Container component is included in the `@aidan/ui` package.

```tsx
import { Container } from "@aidan/ui";
```

## Usage

### Basic Usage

```tsx
<Container>
  <h1>Page Content</h1>
  <p>Your content here...</p>
</Container>
```

### Max Width Variants

Control the maximum width of the container:

```tsx
// Narrow - ideal for forms or dialogs
<Container maxWidth="sm">Content</Container>

// Reading width - ideal for articles
<Container maxWidth="md">Content</Container>

// Standard page width
<Container maxWidth="lg">Content</Container>

// Wide content
<Container maxWidth="xl">Content</Container>

// Dashboard/data-heavy (default)
<Container maxWidth="2xl">Content</Container>

// Full width - no constraint
<Container maxWidth="full">Content</Container>
```

### Padding Options

```tsx
// No padding
<Container padding="none">Edge to edge</Container>

// Tight padding (16px)
<Container padding="tight">Compact</Container>

// Normal responsive padding (default)
<Container padding="normal">Standard</Container>

// Wide padding for reading
<Container padding="wide">Spacious</Container>
```

### Centering

```tsx
// Centered (default)
<Container center>Centered content</Container>

// Left-aligned
<Container center={false}>Left-aligned content</Container>
```

### Background Variants

Use MD3 surface container colors:

```tsx
<Container background="surface">Surface background</Container>
<Container background="container">Container background</Container>
<Container background="containerLow">Low emphasis</Container>
<Container background="containerHigh">High emphasis</Container>
```

### Semantic HTML

Use `asChild` to render as a semantic HTML element:

```tsx
<Container asChild>
  <main>Main content area</main>
</Container>

<Container asChild>
  <section>Section content</section>
</Container>
```

### Nested Containers

Create complex layouts with nested containers:

```tsx
{/* Full-width hero */}
<Container maxWidth="full" padding="none" background="container">
  <Container maxWidth="lg" className="py-16">
    <h1>Hero Title</h1>
  </Container>
</Container>

{/* Regular content */}
<Container maxWidth="lg">
  <p>Page content...</p>
</Container>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxWidth` | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| 'full'` | `'2xl'` | Maximum width constraint |
| `padding` | `'none' \| 'tight' \| 'normal' \| 'wide'` | `'normal'` | Horizontal padding |
| `center` | `boolean` | `true` | Center container horizontally |
| `background` | `'transparent' \| 'surface' \| 'container' \| 'containerLow' \| 'containerHigh'` | `'transparent'` | Background color |
| `asChild` | `boolean` | `false` | Render as child element |
| `className` | `string` | - | Additional CSS classes |

## Breakpoint Reference

| Variant | Max Width | Recommended Use |
|---------|-----------|-----------------|
| `sm` | 640px | Dialogs, narrow forms |
| `md` | 768px | Reading content, articles |
| `lg` | 1024px | Standard page layouts |
| `xl` | 1280px | Wide content, galleries |
| `2xl` | 1400px | Dashboards, data tables |
| `full` | None | Heroes, full-bleed sections |

## Examples

### Article Layout

```tsx
<Container maxWidth="md" padding="wide">
  <article>
    <h1 className="text-3xl font-bold mb-4">Article Title</h1>
    <p className="text-lg text-muted-foreground mb-6">
      Introduction paragraph...
    </p>
    <p>Article content...</p>
  </article>
</Container>
```

### Dashboard Layout

```tsx
<Container maxWidth="2xl">
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-2xl font-bold">Dashboard</h1>
    <Button>Add New</Button>
  </div>
  
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    {/* Stats cards */}
  </div>
</Container>
```

### Landing Page Sections

```tsx
{/* Hero */}
<Container maxWidth="full" padding="none" background="containerLow">
  <Container maxWidth="lg" className="py-24 text-center">
    <h1 className="text-5xl font-bold">Welcome</h1>
  </Container>
</Container>

{/* Features */}
<Container maxWidth="xl" className="py-16">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* Feature cards */}
  </div>
</Container>
```

## Accessibility

- Use `asChild` with semantic HTML elements (`<main>`, `<section>`, `<article>`) for proper document structure
- Container is a layout utility with no interactive behavior
- Background colors maintain WCAG color contrast requirements
