'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { createTaskSchema, type CreateTaskFormData } from '@/lib/validations';
import { tasksAPI, usersAPI } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { Task } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

export function CreateTaskForm() {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useAuthStore();
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CreateTaskFormData>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: {
            date: new Date().toISOString().split('T')[0],
        },
    });

    const { data: associates = [] } = useQuery({
        queryKey: ['associates'],
        queryFn: usersAPI.getAssociates,
    });

    const mutation = useMutation({
        mutationFn: (data: CreateTaskFormData) =>
            tasksAPI.createTask({ ...data, managerId: user!.id }),
        onMutate: async (newTaskData) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ['tasks'] });

            // Snapshot the previous value
            const previousTasks = queryClient.getQueryData(['tasks']);

            // Optimistically update to the new value
            const optimisticTask = {
                id: `temp-${Date.now()}`,
                ...newTaskData,
                managerId: user!.id,
                createdAt: new Date().toISOString(),
            };

            queryClient.setQueryData(['tasks'], (old: any) =>
                old ? [...old, optimisticTask] : [optimisticTask]
            );

            // Return a context object with the snapshotted value
            return { previousTasks };
        },
        onSuccess: (newTask) => {
            console.log('Task created successfully:', newTask);
            // Invalidate all task-related queries to ensure immediate updates
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['assigned-tasks'] });
            queryClient.invalidateQueries({ queryKey: ['timesheet-entries'] });
            reset();
            setIsOpen(false);
        },
        onError: (error, newTaskData, context) => {
            console.error('Failed to create task:', error);
            // If the mutation fails, use the context returned from onMutate to roll back
            if (context?.previousTasks) {
                queryClient.setQueryData(['tasks'], context.previousTasks);
            }
        },
        onSettled: () => {
            // Always refetch after error or success
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    }); const onSubmit = (data: CreateTaskFormData) => {
        mutation.mutate(data);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="flex items-center space-x-2 dashboard-card-orange hover:opacity-90 transition-opacity">
                    <Plus className="h-4 w-4" />
                    <span>Create Task</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] glass-effect border-border">
                <DialogHeader>
                    <DialogTitle className="text-foreground">Create New Task</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="description" className="text-foreground">Task Description</Label>
                        <Input
                            id="description"
                            {...register('description')}
                            placeholder="e.g., Fix Bug A in authentication module"
                            className="mt-1 bg-input border-border text-foreground"
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-destructive">{errors.description.message}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="estimatedHours" className="text-foreground">Estimated Hours</Label>
                        <Input
                            id="estimatedHours"
                            type="number"
                            step="0.1"
                            min="0.1"
                            {...register('estimatedHours', { valueAsNumber: true })}
                            className="mt-1 bg-input border-border text-foreground"
                        />
                        {errors.estimatedHours && (
                            <p className="mt-1 text-sm text-destructive">{errors.estimatedHours.message}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="date" className="text-foreground">Date</Label>
                        <Input
                            id="date"
                            type="date"
                            {...register('date')}
                            className="mt-1 bg-input border-border text-foreground"
                        />
                        {errors.date && (
                            <p className="mt-1 text-sm text-destructive">{errors.date.message}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="assigneeId" className="text-foreground">Assign to</Label>
                        <select
                            id="assigneeId"
                            {...register('assigneeId')}
                            className="mt-1 flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <option value="">Select an associate...</option>
                            {associates.map((associate) => (
                                <option key={associate.id} value={associate.id}>
                                    {associate.name}
                                </option>
                            ))}
                        </select>
                        {errors.assigneeId && (
                            <p className="mt-1 text-sm text-destructive">{errors.assigneeId.message}</p>
                        )}
                    </div>

                    <div className="flex space-x-2 pt-4">
                        <Button
                            type="submit"
                            disabled={mutation.isPending}
                            className="flex-1 dashboard-card-blue hover:opacity-90 transition-opacity"
                        >
                            {mutation.isPending ? 'Creating...' : 'Create Task'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            className="border-border hover:bg-muted text-foreground"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
