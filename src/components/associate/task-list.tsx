'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { tasksAPI } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { Calendar, Clock, Filter } from 'lucide-react';
import { TimesheetEntryForm } from './timesheet-entry-form';

export function TaskList() {
    const { user } = useAuthStore();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');

    const { data: tasks = [] } = useQuery({
        queryKey: ['assigned-tasks', user?.id],
        queryFn: () => tasksAPI.getTasksByAssignee(user!.id),
        enabled: !!user,
    });

    const getWeekStart = (date: string) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        return new Date(d.setDate(diff)).toISOString().split('T')[0];
    };

    const getWeekEnd = (date: string) => {
        const weekStart = new Date(getWeekStart(date));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return weekEnd.toISOString().split('T')[0];
    };

    const filteredTasks = tasks.filter(task => {
        if (viewMode === 'daily') {
            return task.date === selectedDate;
        } else {
            const weekStart = getWeekStart(selectedDate);
            const weekEnd = getWeekEnd(selectedDate);
            return task.date >= weekStart && task.date <= weekEnd;
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 justify-between">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">My Tasks</h2>

                <div className="flex max-sm:justify-between items-center gap-3 sm:gap-4">
                    <div className="flex rounded-md border border-border">
                        <Button
                            variant={viewMode === 'daily' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('daily')}
                            className={`rounded-r-none text-xs sm:text-sm ${viewMode === 'daily' ? 'dashboard-card-blue' : 'border-border hover:bg-muted'}`}
                        >
                            Daily
                        </Button>
                        <Button
                            variant={viewMode === 'weekly' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('weekly')}
                            className={`rounded-l-none text-xs sm:text-sm ${viewMode === 'weekly' ? 'dashboard-card-blue' : 'border-border hover:bg-muted'}`}
                        >
                            Weekly
                        </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                        <div className="p-1 sm:p-1.5 rounded-lg dashboard-card-purple">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                        </div>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="text-sm sm:text-sm border border-border bg-input text-foreground rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>
                </div>
            </div>

            {viewMode === 'weekly' && (
                <div className="dashboard-card-cyan text-white border border-border rounded-md p-3">
                    <p className="text-xs sm:text-sm">
                        <Filter className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1" />
                        Showing tasks for week of {formatDate(getWeekStart(selectedDate))} - {formatDate(getWeekEnd(selectedDate))}
                    </p>
                </div>
            )}

            <div className="grid gap-6">
                {filteredTasks.map((task) => (
                    <Card key={task.id} className="bg-card border-border hover:bg-card/80 transition-colors">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg text-foreground">{task.description}</CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        Date: {formatDate(task.date)}
                                    </p>
                                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                        <div className="p-1 rounded dashboard-card-green">
                                            <Clock className="h-3 w-3 text-white" />
                                        </div>
                                        <span>Estimated: {task.estimatedHours} hours</span>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <TimesheetEntryForm task={task} />
                        </CardContent>
                    </Card>
                ))}

                {filteredTasks.length === 0 && (
                    <Card className="bg-card border-border">
                        <CardContent className="text-center py-8">
                            <div className="p-3 rounded-lg dashboard-card-cyan mx-auto w-fit mb-4">
                                <Calendar className="h-12 w-12 text-white" />
                            </div>
                            <p className="text-muted-foreground">
                                No tasks assigned for{' '}
                                {viewMode === 'daily'
                                    ? formatDate(selectedDate)
                                    : `week of ${formatDate(getWeekStart(selectedDate))}`
                                }.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
