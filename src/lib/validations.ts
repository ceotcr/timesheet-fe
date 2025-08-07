import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const createTaskSchema = z.object({
    description: z.string().min(1, 'Task description is required'),
    estimatedHours: z.number().min(0.1, 'Estimated hours must be at least 0.1'),
    date: z.string().min(1, 'Date is required'),
    assigneeId: z.string().min(1, 'Please select an assignee'),
});

export const timesheetEntrySchema = z.object({
    actualHours: z.number().min(0.1, 'Actual hours must be at least 0.1'),
    notes: z.string().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type CreateTaskFormData = z.infer<typeof createTaskSchema>;
export type TimesheetEntryFormData = z.infer<typeof timesheetEntrySchema>;
