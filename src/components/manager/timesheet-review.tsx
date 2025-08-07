'use client';

import { useQuery } from '@tanstack/react-query';
import { timesheetAPI, tasksAPI, usersAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, formatDateTime } from '@/lib/utils';
import { FileText, Clock } from 'lucide-react';

export function TimesheetReview() {
    const { data: timesheetEntries = [] } = useQuery({
        queryKey: ['timesheet-entries'],
        queryFn: () => timesheetAPI.getTimesheetEntries(),
    });

    const { data: tasks = [] } = useQuery({
        queryKey: ['tasks'],
        queryFn: tasksAPI.getTasks,
    });

    const { data: users = [] } = useQuery({
        queryKey: ['users'],
        queryFn: usersAPI.getUsers,
    });

    const getUserName = (userId: string) => {
        return users.find(user => user.id === userId)?.name || 'Unknown';
    };

    const getTaskDescription = (taskId: string) => {
        return tasks.find(task => task.id === taskId)?.description || 'Unknown Task';
    };

    const submittedEntries = timesheetEntries.filter(entry => entry.submitted);

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Submitted Timesheets</h2>

            <div className="grid gap-4">
                {submittedEntries.map((entry) => (
                    <Card key={entry.id}>
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg flex items-center space-x-2">
                                        <FileText className="h-5 w-5" />
                                        <span>{getTaskDescription(entry.taskId)}</span>
                                    </CardTitle>
                                    <p className="text-sm text-gray-600">
                                        Employee: {getUserName(entry.userId)}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Date: {formatDate(entry.date)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-semibold text-blue-600">
                                        {entry.actualHours}h
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Submitted: {entry.submittedAt ? formatDateTime(entry.submittedAt) : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        {entry.notes && (
                            <CardContent>
                                <div className="bg-gray-50 rounded-md p-3">
                                    <p className="text-sm text-gray-700">
                                        <span className="font-medium">Notes:</span> {entry.notes}
                                    </p>
                                </div>
                            </CardContent>
                        )}
                    </Card>
                ))}

                {submittedEntries.length === 0 && (
                    <Card>
                        <CardContent className="text-center py-8">
                            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No submitted timesheets yet.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
