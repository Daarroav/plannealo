# Overview

PLANNEALO is a comprehensive travel itinerary management platform designed for travel agencies. The system allows agents to create, manage, and publish detailed travel itineraries for their clients. The platform features a modern web application with React frontend and Node.js/Express backend, including advanced calendar visualization, PDF generation with professional branding, object storage for cover images, and comprehensive travel component management with file upload capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with a neutral gray/white color scheme and red accents (max 10%)
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation schemas
- **File Structure**: Clean separation with components, pages, hooks, and utilities
- **Calendar View**: Custom calendar component with pastel color coding for published/unpublished travels
- **File Upload**: Uppy-based ObjectUploader component for cover image management

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Authentication**: Custom session-based authentication using Passport.js with LocalStrategy
- **Session Management**: Express-session with in-memory store for development
- **Password Security**: Crypto module with scrypt for secure password hashing
- **API Design**: RESTful API structure with comprehensive error handling

## Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: Configured for PostgreSQL (currently using Neon Database serverless)
- **Schema Design**: Relational model with separate tables for users, travels, accommodations, activities, flights, and transports
- **Migration Management**: Drizzle Kit for schema migrations and database management

## Authentication & Authorization
- **Strategy**: Custom implementation avoiding Replit Auth
- **Session Security**: Secure session cookies with configurable secret
- **User Roles**: Role-based system with agent permissions
- **Route Protection**: Higher-order components for protecting authenticated routes

## Data Architecture
- **Travel Management**: Complete CRUD operations for travel itineraries with cover image support
- **Booking Components**: Separate entities for accommodations, activities, flights, transportation, cruises, and insurance
- **Status Management**: Draft/published workflow for travel itineraries with calendar visualization
- **Client Association**: Direct linking between travels and client information
- **Document Management**: Notes system with file uploads and traveler visibility controls
- **Object Storage**: Google Cloud Storage integration for cover images and document attachments

## Development Workflow
- **Build Process**: Vite for frontend bundling, esbuild for server compilation
- **Development Server**: Hot module replacement and development error overlay
- **Type Safety**: Full TypeScript coverage across frontend, backend, and shared schemas
- **Code Organization**: Monorepo structure with shared types and schemas

# External Dependencies

## UI and Component Libraries
- **Radix UI**: Complete set of accessible UI primitives for building the interface
- **Lucide React**: Icon library for consistent iconography
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Class Variance Authority**: Component variant management
- **React Hook Form**: Form state management and validation

## Backend Services
- **Neon Database**: Serverless PostgreSQL database hosting
- **Express Session**: Session management middleware
- **Passport.js**: Authentication middleware with local strategy
- **Crypto**: Built-in Node.js module for password hashing

## File Upload Capabilities
- **Uppy**: File upload library with drag-and-drop interface for document management
- **Google Cloud Storage**: Cloud storage service for cover images and travel document attachments
- **Object Storage Service**: Custom service with ACL policies for public/private file management
- **PDF Generation**: Professional travel itinerary PDFs with PLANNEALO branding and cover images

## Development Tools
- **Vite**: Fast build tool and development server
- **Drizzle Kit**: Database migration and management tools
- **ESBuild**: Fast JavaScript bundler for production builds
- **TypeScript**: Static type checking and enhanced developer experience

## State Management
- **TanStack Query**: Server state synchronization and caching
- **React Context**: Client-side state management for authentication
- **Wouter**: Lightweight routing solution

## Validation and Schemas
- **Zod**: Runtime type validation and schema definition
- **Drizzle Zod**: Integration between Drizzle ORM and Zod schemas
- **Form Validation**: Client and server-side validation consistency