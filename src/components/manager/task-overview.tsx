'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { tasksAPI, timesheetAPI, usersAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { Clock, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export function TaskOverview() {
    const queryClient = useQueryClient();
    const { data: tasks = [], isLoading, error } = useQuery({
        queryKey: ['tasks'],
        queryFn: tasksAPI.getTasks,
    });

    const { data: timesheetEntries = [] } = useQuery({
        queryKey: ['timesheet-entries'],
        queryFn: () => timesheetAPI.getTimesheetEntries(),
    });

    const { data: users = [] } = useQuery({
        queryKey: ['users'],
        queryFn: usersAPI.getUsers,
    });

    // Debug logging
    console.log('TaskOverview - tasks:', tasks);
    console.log('TaskOverview - isLoading:', isLoading);
    console.log('TaskOverview - error:', error);

    const handleRefresh = () => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        queryClient.invalidateQueries({ queryKey: ['timesheet-entries'] });
    };

    const getUserName = (userId: string) => {
        return users.find(user => user.id === userId)?.name || 'Unknown';
    };

    const getTaskProgress = (taskId: string) => {
        const entries = timesheetEntries.filter(entry => entry.taskId === taskId);
        const actualHours = entries.reduce((sum, entry) => sum + entry.actualHours, 0);
        const submitted = entries.some(entry => entry.submitted);
        return { actualHours, submitted };
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Task Overview</h2>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="flex items-center space-x-2"
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                </Button>
            </div>

            {isLoading && (
                <Card>
                    <CardContent className="text-center py-8">
                        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
                        <p className="text-gray-500">Loading tasks...</p>
                    </CardContent>
                </Card>
            )}

            {error && (
                <Card>
                    <CardContent className="text-center py-8">
                        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                        <p className="text-red-500">Error loading tasks. Please try again.</p>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4">{!isLoading && !error && tasks.map((task) => {
                const progress = getTaskProgress(task.id);
                const isOverTime = progress.actualHours > task.estimatedHours;
                const isCompleted = progress.submitted;

                return (
                    <Card key={task.id}>
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg">{task.description}</CardTitle>
                                    <p className="text-sm text-gray-600">
                                        Assigned to: {getUserName(task.assigneeId)}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Date: {formatDate(task.date)}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {isCompleted ? (
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                    ) : isOverTime ? (
                                        <AlertCircle className="h-5 w-5 text-red-600" />
                                    ) : (
                                        <Clock className="h-5 w-5 text-blue-600" />
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex space-x-4">
                                    <span>
                                        <span className="font-medium">Estimated:</span> {task.estimatedHours}h
                                    </span>
                                    <span>
                                        <span className="font-medium">Actual:</span>{' '}
                                        <span className={isOverTime ? 'text-red-600 font-medium' : ''}>
                                            {progress.actualHours}h
                                        </span>
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${isCompleted
                                            ? 'bg-green-100 text-green-800'
                                            : isOverTime
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-blue-100 text-blue-800'
                                            }`}
                                    >
                                        {isCompleted
                                            ? 'Completed'
                                            : isOverTime
                                                ? 'Over Time'
                                                : 'In Progress'}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}

                {tasks.length === 0 && (
                    <Card>
                        <CardContent className="text-center py-8">
                            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No tasks created yet.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
