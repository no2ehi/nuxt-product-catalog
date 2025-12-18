# Nuxt Product Catalog

A modern product catalog application built with Nuxt 3, featuring product listing, search, filtering, and detailed product views.

**Live Demo**: [https://nuxt-product-catalog.vercel.app/](https://nuxt-product-catalog.vercel.app/)

## Tech Stack

- **Framework**: Nuxt 3
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (Vue Query)
- **Virtual Scrolling**: TanStack Virtual
- **Testing**: Vitest
- **Linting**: ESLint
- **Formatting**: Prettier
- **Package Manager**: pnpm

## Features

### Product Management

- **Product Listing**: Browse products with infinite scroll pagination
- **Product Details**: View detailed product information with images, pricing, and ratings
- **Product Creation**: Create new products with a comprehensive form
- **Product Search**: Real-time search with debounced input for optimal performance
- **Category Filtering**: Filter products by category
- **Sorting**: Sort products by price or rating (ascending/descending)

### Performance Optimizations

- **Virtual Scrolling**: Efficient rendering of large product lists using TanStack Virtual
- **SWR Caching**: Stale-While-Revalidate caching strategy for faster page loads
- **Background Revalidation**: Automatic data refresh in the background when data becomes stale
- **Debounced Search**: Optimized search input to reduce API calls

### User Experience

- **Loading States**: Skeleton loaders and loading indicators for better UX
- **Error Handling**: Comprehensive error states with user-friendly messages
- **Empty States**: Informative empty states when no products are found
- **Scroll to Top**: Smooth scroll-to-top button for easy navigation
- **Responsive Design**: Mobile-first responsive layout with Tailwind CSS

### Developer Experience

- **TypeScript**: Full type safety throughout the application
- **Code Quality**: ESLint and Prettier for consistent code style
- **Testing**: Vitest for unit and component testing
- **Git Hooks**: Husky and lint-staged for pre-commit checks

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (v8 or higher) - [Installation guide](https://pnpm.io/installation)

## Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd nxut-product-catalog
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:

   ```env
   NUXT_PUBLIC_API_BASE=https://your-api-url.com
   ```

4. **Install Git hooks** (optional, but recommended)

   Git hooks are automatically set up via Husky after installation. They will run linting and formatting on commit.

## Development

Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm generate` - Generate static site
- `pnpm preview` - Preview production build locally
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Run ESLint and fix issues
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting
- `pnpm test` - Run tests in watch mode
- `pnpm test:run` - Run tests once
- `pnpm test:coverage` - Run tests with coverage report

## Build

### Production Build

Build the application for production:

```bash
pnpm build
```

The output will be in the `.output` directory.

### Preview Production Build

Preview the production build locally:

```bash
pnpm build
pnpm preview
```

## Testing

Run tests using Vitest:

```bash
# Watch mode
pnpm test

# Run once
pnpm test:run

# With coverage
pnpm test:coverage
```

## Code Quality

### Linting

Check code for linting errors:

```bash
pnpm lint
```

Auto-fix linting issues:

```bash
pnpm lint:fix
```

### Formatting

Format code with Prettier:

```bash
pnpm format
```

Check formatting without making changes:

```bash
pnpm format:check
```

## Project Structure

```
nxut-product-catalog/
├── assets/          # Static assets (CSS, images)
├── components/      # Vue components
│   ├── layout/     # Layout components
│   ├── pages/      # Page-specific components
│   └── ui/         # Reusable UI components
├── composables/    # Vue composables
├── enums/          # TypeScript enums
├── layouts/        # Nuxt layouts
├── pages/          # Nuxt pages (file-based routing)
├── plugins/        # Nuxt plugins
├── services/       # API services
├── types/          # TypeScript type definitions
└── tests/          # Test files
```

## Deployment

### Deploy to Vercel

1. Import your GitHub repository on [Vercel](https://vercel.com)
2. Configure Environment Variables in Vercel project settings:
   ```
   NUXT_PUBLIC_API_BASE=https://your-api-url.com
   ```
3. Vercel will automatically detect Nuxt 3 and deploy your application

The project includes `vercel.json` configuration for optimal deployment settings.
