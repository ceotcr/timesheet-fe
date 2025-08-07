import { User, Task, TimesheetEntry, LoginCredentials, CreateTaskData, TimesheetEntryData } from '@/types';

// Mock data
const mockUsers: User[] = [
    {
        id: '1',
        email: 'manager@company.com',
        name: 'John Manager',
        role: 'manager',
    },
    {
        id: '2',
        email: 'associate1@company.com',
        name: 'Alice Associate',
        role: 'associate',
    },
    {
        id: '3',
        email: 'associate2@company.com',
        name: 'Bob Associate',
        role: 'associate',
    },
];

const mockTasks: Task[] = [
    {
        id: '1',
        description: 'Fix Bug A in authentication module',
        estimatedHours: 4,
        date: '2025-08-07',
        assigneeId: '2',
        managerId: '1',
        createdAt: '2025-08-07T09:00:00Z',
    },
    {
        id: '2',
        description: 'Implement user dashboard',
        estimatedHours: 8,
        date: '2025-08-07',
        assigneeId: '3',
        managerId: '1',
        createdAt: '2025-08-07T09:30:00Z',
    },
    {
        id: '3',
        description: 'Code review for API endpoints',
        estimatedHours: 2,
        date: '2025-08-08',
        assigneeId: '2',
        managerId: '1',
        createdAt: '2025-08-07T10:00:00Z',
    },
];

const mockTimesheetEntries: TimesheetEntry[] = [
    {
        id: '1',
        taskId: '1',
        actualHours: 3.5,
        date: '2025-08-07',
        notes: 'Fixed authentication bug, took less time than expected',
        userId: '2',
        submitted: true,
        submittedAt: '2025-08-07T17:30:00Z',
    },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authAPI = {
    login: async (credentials: LoginCredentials): Promise<User> => {
        await delay(500);
        const user = mockUsers.find(u => u.email === credentials.email);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        return user;
    },
};

export const tasksAPI = {
    getTasks: async (): Promise<Task[]> => {
        await delay(300);
        return mockTasks;
    },

    getTasksByAssignee: async (assigneeId: string): Promise<Task[]> => {
        await delay(300);
        return mockTasks.filter(task => task.assigneeId === assigneeId);
    },

    createTask: async (data: CreateTaskData & { managerId: string }): Promise<Task> => {
        await delay(500);
        const newTask: Task = {
            id: Date.now().toString(),
            ...data,
            createdAt: new Date().toISOString(),
        };
        mockTasks.push(newTask);
        return newTask;
    },
};

export const timesheetAPI = {
    getTimesheetEntries: async (userId?: string): Promise<TimesheetEntry[]> => {
        await delay(300);
        if (userId) {
            return mockTimesheetEntries.filter(entry => entry.userId === userId);
        }
        return mockTimesheetEntries;
    },

    createTimesheetEntry: async (data: TimesheetEntryData & { userId: string }): Promise<TimesheetEntry> => {
        await delay(500);
        const newEntry: TimesheetEntry = {
            id: Date.now().toString(),
            date: new Date().toISOString().split('T')[0],
            submitted: false,
            ...data,
        };
        mockTimesheetEntries.push(newEntry);
        return newEntry;
    },

    updateTimesheetEntry: async (id: string, data: Partial<TimesheetEntryData>): Promise<TimesheetEntry> => {
        await delay(500);
        const entryIndex = mockTimesheetEntries.findIndex(entry => entry.id === id);
        if (entryIndex === -1) {
            throw new Error('Timesheet entry not found');
        }

        const updatedEntry = { ...mockTimesheetEntries[entryIndex], ...data };
        mockTimesheetEntries[entryIndex] = updatedEntry;
        return updatedEntry;
    },

    submitTimesheet: async (entryId: string): Promise<TimesheetEntry> => {
        await delay(500);
        const entryIndex = mockTimesheetEntries.findIndex(entry => entry.id === entryId);
        if (entryIndex === -1) {
            throw new Error('Timesheet entry not found');
        }

        mockTimesheetEntries[entryIndex] = {
            ...mockTimesheetEntries[entryIndex],
            submitted: true,
            submittedAt: new Date().toISOString(),
        };
        return mockTimesheetEntries[entryIndex];
    },
};

export const usersAPI = {
    getUsers: async (): Promise<User[]> => {
        await delay(300);
        return mockUsers;
    },

    getAssociates: async (): Promise<User[]> => {
        await delay(300);
        return mockUsers.filter(user => user.role === 'associate');
    },
};
