'use client';

import { TaskList } from '@/components/associate/task-list';

export function AssociateDashboard() {
    return (
        <div className="space-y-6 sm:space-y-8">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My Dashboard</h1>
                <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                    Track your assigned tasks and log your work hours.
                </p>
            </div>

            <TaskList />
        </div>
    );
}
