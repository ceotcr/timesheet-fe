# Timesheet Management System

A modern web-based Timesheet Management System built with Next.js 14+, React, TypeScript, and modern tools for efficient tracking of work hours by employees and oversight by managers.

## Features

### 🔐 Authentication & Authorization
- Secure login mechanism
- Role-based access control (Manager vs Associate)
- Session management with Zustand

### 👨‍💼 Manager Dashboard
- **Task Assignment**: Create and assign tasks to associates with:
  - Task description
  - Estimated hours
  - Due date
  - Assignee selection
- **Task Overview**: Monitor all tasks with:
  - Planned vs actual hours tracking
  - Task completion status
  - Over-time alerts
- **Timesheet Review**: View submitted timesheets with read-only access

### 👩‍💻 Associate Dashboard
- **Task Management**: View assigned tasks filtered by:
  - Daily view
  - Weekly view
  - Date-specific filtering
- **Time Tracking**: Record actual hours worked on each task
- **Timesheet Submission**: Submit timesheets (becomes read-only after submission)

## Tech Stack

### Frontend
- **Next.js 14+** - React framework with App Router
- **React 19** - UI library with latest features
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled UI components

### State Management & Data Fetching
- **Zustand** - Lightweight state management
- **TanStack Query** - Server state management and caching
- **React Hook Form** - Performant forms with minimal re-renders
- **Zod** - TypeScript-first schema validation

### UI Components
- **Lucide React** - Beautiful icons
- **CVA (Class Variance Authority)** - Component variants
- **clsx & tailwind-merge** - Conditional styling utilities

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd timesheet-fe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Demo Accounts

The application comes with pre-configured demo accounts:

### Manager Account
- **Email**: `manager@company.com`
- **Password**: Any password (authentication is mocked)
- **Access**: Full manager privileges

### Associate Accounts
- **Email**: `associate1@company.com` or `associate2@company.com`
- **Password**: Any password (authentication is mocked)
- **Access**: Associate-level privileges

## Usage Guide

### For Managers

1. **Login** with manager credentials
2. **Create Tasks**: 
   - Click "Create Task" button
   - Fill in task details (description, estimated hours, date, assignee)
   - Submit to assign the task
3. **Monitor Progress**:
   - View task overview to see planned vs actual hours
   - Check for over-time alerts
   - Review completion status
4. **Review Timesheets**:
   - View all submitted timesheets
   - See actual hours worked and notes
   - Read-only access to submitted entries

### For Associates

1. **Login** with associate credentials
2. **View Tasks**:
   - Switch between daily and weekly views
   - Use date picker to filter tasks
   - See estimated hours for each task
3. **Log Hours**:
   - Enter actual hours worked
   - Add optional notes
   - Save or update entries
4. **Submit Timesheets**:
   - Click "Submit" on completed tasks
   - Submitted timesheets become read-only
   - Track submission status

### Data Flow
1. **Mock API**: In-memory data simulation with realistic delays
2. **Query Caching**: Automatic background refetching and cache management
3. **Optimistic Updates**: Immediate UI updates with rollback on error
4. **Type Safety**: End-to-end TypeScript for reliable data flow
