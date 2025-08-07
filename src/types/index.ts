export interface User {
    id: string;
    email: string;
    name: string;
    role: 'manager' | 'associate';
}

export interface Task {
    id: string;
    description: string;
    estimatedHours: number;
    date: string;
    assigneeId: string;
    managerId: string;
    createdAt: string;
}

export interface TimesheetEntry {
    id: string;
    taskId: string;
    actualHours: number;
    date: string;
    notes?: string;
    userId: string;
    submitted: boolean;
    submittedAt?: string;
}

export type AuthUser = User;

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface CreateTaskData {
    description: string;
    estimatedHours: number;
    date: string;
    assigneeId: string;
}

export interface TimesheetEntryData {
    taskId: string;
    actualHours: number;
    notes?: string;
}
