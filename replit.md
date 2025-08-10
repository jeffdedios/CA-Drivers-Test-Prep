# Overview

This is a California Driver's License Test Prep mobile web application built with React and TypeScript. The app provides interactive flashcard-style studying for California DMV handbook questions, featuring multiple study modes (sequential, random, review), category filtering, progress tracking, and bookmarking functionality. The application is designed with a mobile-first approach and includes a comprehensive question database with explanations.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **State Management**: TanStack Query (React Query) for server state and local React state for UI
- **Mobile-First Design**: Responsive layout optimized for mobile devices with touch gestures

## Backend Architecture
- **Runtime**: Node.js with Express.js server
- **API Design**: RESTful endpoints with JSON responses
- **Data Storage**: In-memory storage implementation with interface for future database integration
- **Development Setup**: Vite middleware integration for hot module replacement

## Key Features
- **Study Modes**: Sequential, random, and review modes for different learning approaches
- **Category Filtering**: Questions organized by DMV handbook sections (laws, signs, safety, alcohol)
- **Progress Tracking**: User progress persistence with statistics and accuracy metrics
- **Bookmarking System**: Save questions for later review
- **Flashcard Interface**: Interactive Q&A with immediate feedback and explanations
- **Mobile Gestures**: Touch support for swipe navigation between questions

## Data Models
- **Questions**: Multiple choice questions with 4 options, correct answer index, explanations, and categorization
- **User Progress**: Tracks answered questions, correctness, bookmarks, and review flags per user
- **Study Sessions**: Records study session metadata including mode, category, and performance metrics

## API Endpoints
- `GET /api/questions` - Fetch all questions or filter by category
- `GET /api/questions/:id` - Get specific question details
- `GET /api/progress/:userId` - Retrieve user progress data
- `POST /api/progress/:userId/:questionId` - Update progress for specific question

# External Dependencies

## Core Framework Dependencies
- **React 18**: Frontend framework with JSX/TSX support
- **TypeScript**: Type safety and development tooling
- **Vite**: Build tool and development server
- **Express.js**: Backend web server framework

## UI and Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives (@radix-ui/react-*)
- **Shadcn/ui**: Pre-built component library with consistent design
- **Lucide React**: Icon library for UI elements
- **Google Fonts**: Inter font family for typography

## Data and State Management
- **TanStack Query**: Server state management and caching
- **Drizzle ORM**: Database toolkit with PostgreSQL support
- **Zod**: Schema validation for forms and API data
- **React Hook Form**: Form handling with validation

## Database and Storage
- **PostgreSQL**: Database engine (configured via Drizzle)
- **Neon Database**: Serverless PostgreSQL provider (@neondatabase/serverless)
- **Drizzle Kit**: Database migration and schema management tools

## Development Tools
- **ESBuild**: JavaScript bundler for production builds
- **PostCSS**: CSS processing with Autoprefixer
- **Wouter**: Lightweight routing library
- **Date-fns**: Date manipulation utilities

## Replit-Specific
- **Replit Development Tools**: Error overlay and cartographer for development environment integration