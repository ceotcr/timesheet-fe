'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { timesheetEntrySchema, type TimesheetEntryFormData } from '@/lib/validations';
import { timesheetAPI } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { Task, TimesheetEntry } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock, Send, Edit2, Check } from 'lucide-react';

interface TimesheetEntryFormProps {
    task: Task;
}

export function TimesheetEntryForm({ task }: TimesheetEntryFormProps) {
    const { user } = useAuthStore();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);

    const { data: timesheetEntries = [] } = useQuery({
        queryKey: ['timesheet-entries', user?.id],
        queryFn: () => timesheetAPI.getTimesheetEntries(user!.id),
        enabled: !!user,
    });

    // Find existing entry for this task and current date
    const existingEntry = timesheetEntries.find(
        entry => entry.taskId === task.id && entry.userId === user!.id
    ); const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<TimesheetEntryFormData>({
        resolver: zodResolver(timesheetEntrySchema),
        defaultValues: {
            actualHours: existingEntry?.actualHours || 0,
            notes: existingEntry?.notes || '',
        },
    });

    // Set form values when existing entry changes
    useEffect(() => {
        if (existingEntry) {
            setValue('actualHours', existingEntry.actualHours);
            setValue('notes', existingEntry.notes || '');
        }
    }, [existingEntry, setValue]);

    const createMutation = useMutation({
        mutationFn: (data: TimesheetEntryFormData) =>
            timesheetAPI.createTimesheetEntry({
                ...data,
                taskId: task.id,
                userId: user!.id,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['timesheet-entries', user?.id] });
            setIsEditing(false);
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: TimesheetEntryFormData) =>
            timesheetAPI.updateTimesheetEntry(existingEntry!.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['timesheet-entries', user?.id] });
            setIsEditing(false);
        },
    });

    const submitMutation = useMutation({
        mutationFn: () => timesheetAPI.submitTimesheet(existingEntry!.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['timesheet-entries', user?.id] });
            queryClient.invalidateQueries({ queryKey: ['timesheet-entries'] }); // For manager view
        },
    });

    const onSubmit = (data: TimesheetEntryFormData) => {
        if (existingEntry) {
            updateMutation.mutate(data);
        } else {
            createMutation.mutate(data);
        }
    };

    const handleSubmitTimesheet = () => {
        if (existingEntry && !existingEntry.submitted) {
            submitMutation.mutate();
        }
    };

    const isSubmitted = existingEntry?.submitted || false;
    const canEdit = !isSubmitted && (isEditing || !existingEntry);
    const isTaskToday = task.date === new Date().toISOString().split('T')[0];
    const isTaskOverdue = task.date < new Date().toISOString().split('T')[0];

    // Don't show form for future tasks or overdue tasks unless there's already an entry
    if (!isTaskToday && !existingEntry && !isTaskOverdue) {
        return (
            <div className="bg-muted rounded-md p-4">
                <p className="text-sm text-muted-foreground">
                    Task scheduled for {new Date(task.date).toLocaleDateString()}.
                    You can log hours on the task date.
                </p>
            </div>
        );
    } if (existingEntry && !isEditing && !isSubmitted) {
        return (
            <div className="space-y-4">
                <div className="bg-muted rounded-md p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-foreground">
                                Actual Hours: {existingEntry.actualHours}h
                            </p>
                            {existingEntry.notes && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    Notes: {existingEntry.notes}
                                </p>
                            )}
                        </div>
                        <div className="flex space-x-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setIsEditing(true)}
                                className="flex items-center space-x-1 border-border hover:bg-muted"
                            >
                                <Edit2 className="h-3 w-3" />
                                <span>Edit</span>
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleSubmitTimesheet}
                                disabled={submitMutation.isPending}
                                className="flex items-center space-x-1 dashboard-card-blue hover:opacity-90 transition-opacity"
                            >
                                <Send className="h-3 w-3" />
                                <span>Submit</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className="bg-green-500/10 border border-green-400/20 rounded-md p-4">
                <div className="flex items-center space-x-2">
                    <div className="p-1.5 rounded-full bg-green-400/20">
                        <Check className="h-4 w-4 text-green-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-green-300">
                            Timesheet Submitted ({existingEntry?.actualHours}h)
                        </p>
                        {existingEntry?.notes && (
                            <p className="text-sm text-green-400/80 mt-1">
                                Notes: {existingEntry.notes}
                            </p>
                        )}
                        <p className="text-xs text-green-500/70 mt-1">
                            Submitted on: {existingEntry?.submittedAt ?
                                new Date(existingEntry.submittedAt).toLocaleString() : 'N/A'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor={`hours-${task.id}`} className="text-foreground">Actual Hours</Label>
                    <Input
                        id={`hours-${task.id}`}
                        type="number"
                        step="0.1"
                        min="0.1"
                        {...register('actualHours', { valueAsNumber: true })}
                        className="mt-1 bg-input border-border text-foreground"
                        placeholder="0.0"
                    />
                    {errors.actualHours && (
                        <p className="mt-1 text-sm text-destructive">{errors.actualHours.message}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor={`notes-${task.id}`} className="text-foreground">Notes (optional)</Label>
                    <Input
                        id={`notes-${task.id}`}
                        {...register('notes')}
                        className="mt-1 bg-input border-border text-foreground"
                        placeholder="Add any notes..."
                    />
                </div>
            </div>

            <div className="flex space-x-2">
                <Button
                    type="submit"
                    size="sm"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="flex items-center space-x-1 dashboard-card-purple hover:opacity-90 transition-opacity"
                >
                    <Clock className="h-3 w-3 text-white" />
                    <span>
                        {existingEntry ? 'Update' : 'Log'} Hours
                    </span>
                </Button>

                {isEditing && (
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                            setIsEditing(false);
                            reset();
                        }}
                        className="border-border hover:bg-muted text-foreground"
                    >
                        Cancel
                    </Button>
                )}
            </div>
        </form>
    );
}
