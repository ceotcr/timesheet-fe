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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Task Overview</h2>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="flex items-center space-x-2 border-border hover:bg-muted"
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                </Button>
            </div>

            {isLoading && (
                <Card className="bg-card border-border">
                    <CardContent className="text-center py-8">
                        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-spin" />
                        <p className="text-muted-foreground">Loading tasks...</p>
                    </CardContent>
                </Card>
            )}

            {error && (
                <Card className="bg-card border-border">
                    <CardContent className="text-center py-8">
                        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                        <p className="text-destructive">Error loading tasks. Please try again.</p>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-6">{!isLoading && !error && tasks.map((task) => {
                const progress = getTaskProgress(task.id);
                const isOverTime = progress.actualHours > task.estimatedHours;
                const isCompleted = progress.submitted;

                return (
                    <Card key={task.id} className="bg-card border-border hover:bg-card/80 transition-colors">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg text-foreground">{task.description}</CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        Assigned to: {getUserName(task.assigneeId)}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Date: {formatDate(task.date)}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {isCompleted ? (
                                        <div className="p-1.5 rounded-lg dashboard-card-green">
                                            <CheckCircle className="h-4 w-4 text-white" />
                                        </div>
                                    ) : isOverTime ? (
                                        <div className="p-1.5 rounded-lg bg-destructive">
                                            <AlertCircle className="h-4 w-4 text-white" />
                                        </div>
                                    ) : (
                                        <div className="p-1.5 rounded-lg dashboard-card-blue">
                                            <Clock className="h-4 w-4 text-white" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex space-x-4">
                                    <span className="text-foreground">
                                        <span className="font-medium">Estimated:</span> {task.estimatedHours}h
                                    </span>
                                    <span className="text-foreground">
                                        <span className="font-medium">Actual:</span>{' '}
                                        <span className={isOverTime ? 'text-destructive font-medium' : ''}>
                                            {progress.actualHours}h
                                        </span>
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${isCompleted
                                            ? 'dashboard-card-green text-white'
                                            : isOverTime
                                                ? 'bg-destructive text-white'
                                                : 'dashboard-card-blue text-white'
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
                    <Card className="bg-card border-border">
                        <CardContent className="text-center py-8">
                            <div className="p-3 rounded-lg dashboard-card-cyan mx-auto w-fit mb-4">
                                <Clock className="h-12 w-12 text-white" />
                            </div>
                            <p className="text-muted-foreground">No tasks created yet.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
