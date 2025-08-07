'use client';

import { CreateTaskForm } from '@/components/manager/create-task-form';
import { TaskOverview } from '@/components/manager/task-overview';
import { TimesheetReview } from '@/components/manager/timesheet-review';

export function ManagerDashboard() {
    return (
        <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-2 justify-between">
                <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Manager Dashboard</h1>
                    <p className="text-muted-foreground mt-1 text-sm sm:text-base">Monitor tasks and team performance</p>
                </div>
                <div className="flex-shrink-0">
                    <CreateTaskForm />
                </div>
            </div>

            <div className="grid gap-6 sm:gap-8 xl:grid-cols-2">
                <div className="order-1">
                    <TaskOverview />
                </div>
                <div className="order-2">
                    <TimesheetReview />
                </div>
            </div>
        </div>
    );
}
