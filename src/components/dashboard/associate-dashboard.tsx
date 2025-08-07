'use client';

import { TaskList } from '@/components/associate/task-list';

export function AssociateDashboard() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
                <p className="text-gray-600 mt-2">
                    Track your assigned tasks and log your work hours.
                </p>
            </div>

            <TaskList />
        </div>
    );
}
