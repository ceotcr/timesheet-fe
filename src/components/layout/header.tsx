'use client';

import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { LogOut, Clock } from 'lucide-react';

export function Header() {
    const { user, logout } = useAuthStore();

    if (!user) return null;

    return (
        <header className="border-b bg-white">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Clock className="h-6 w-6 text-blue-600" />
                    <h1 className="text-xl font-bold text-gray-900">Timesheet Manager</h1>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="text-sm">
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-gray-500 capitalize">{user.role}</p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={logout}
                        className="flex items-center space-x-2"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}
