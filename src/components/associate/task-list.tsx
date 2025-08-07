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
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">My Tasks</h2>

                <div className="flex items-center space-x-4">
                    <div className="flex rounded-md border">
                        <Button
                            variant={viewMode === 'daily' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('daily')}
                            className="rounded-r-none"
                        >
                            Daily
                        </Button>
                        <Button
                            variant={viewMode === 'weekly' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('weekly')}
                            className="rounded-l-none"
                        >
                            Weekly
                        </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="text-sm border rounded-md px-2 py-1"
                        />
                    </div>
                </div>
            </div>

            {viewMode === 'weekly' && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                    <p className="text-sm text-blue-800">
                        <Filter className="h-4 w-4 inline mr-1" />
                        Showing tasks for week of {formatDate(getWeekStart(selectedDate))} - {formatDate(getWeekEnd(selectedDate))}
                    </p>
                </div>
            )}

            <div className="grid gap-4">
                {filteredTasks.map((task) => (
                    <Card key={task.id}>
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg">{task.description}</CardTitle>
                                    <p className="text-sm text-gray-500">
                                        Date: {formatDate(task.date)}
                                    </p>
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <Clock className="h-4 w-4" />
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
                    <Card>
                        <CardContent className="text-center py-8">
                            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">
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
