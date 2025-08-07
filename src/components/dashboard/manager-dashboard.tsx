'use client';

import { CreateTaskForm } from '@/components/manager/create-task-form';
import { TaskOverview } from '@/components/manager/task-overview';
import { TimesheetReview } from '@/components/manager/timesheet-review';

export function ManagerDashboard() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
                <CreateTaskForm />
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                <div>
                    <TaskOverview />
                </div>
                <div>
                    <TimesheetReview />
                </div>
            </div>
        </div>
    );
}
