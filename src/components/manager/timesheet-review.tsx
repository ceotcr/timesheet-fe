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
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Submitted Timesheets</h2>

            <div className="grid gap-6">
                {submittedEntries.map((entry) => (
                    <Card key={entry.id} className="bg-card border-border hover:bg-card/80 transition-colors">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg flex items-center space-x-2 text-foreground">
                                        <div className="p-1.5 rounded-lg dashboard-card-purple">
                                            <FileText className="h-4 w-4 text-white" />
                                        </div>
                                        <span>{getTaskDescription(entry.taskId)}</span>
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        Employee: {getUserName(entry.userId)}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Date: {formatDate(entry.date)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="px-3 py-1 rounded-lg dashboard-card-cyan text-white">
                                        <p className="text-lg font-semibold">
                                            {entry.actualHours}h
                                        </p>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Submitted: {entry.submittedAt ? formatDateTime(entry.submittedAt) : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        {entry.notes && (
                            <CardContent>
                                <div className="bg-muted rounded-md p-3">
                                    <p className="text-sm text-foreground">
                                        <span className="font-medium">Notes:</span> {entry.notes}
                                    </p>
                                </div>
                            </CardContent>
                        )}
                    </Card>
                ))}

                {submittedEntries.length === 0 && (
                    <Card className="bg-card border-border">
                        <CardContent className="text-center py-8">
                            <div className="p-3 rounded-lg dashboard-card-purple mx-auto w-fit mb-4">
                                <Clock className="h-12 w-12 text-white" />
                            </div>
                            <p className="text-muted-foreground">No submitted timesheets yet.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
