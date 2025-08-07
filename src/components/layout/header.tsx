'use client';

import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { LogOut, Clock } from 'lucide-react';

export function Header() {
    const { user, logout } = useAuthStore();

    if (!user) return null;

    return (
        <header className="border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="p-1.5 sm:p-2 rounded-lg dashboard-card-blue">
                        <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <h1 className="text-lg sm:text-xl font-bold text-foreground hidden sm:block">
                        Timesheet Manager
                    </h1>
                    <h1 className="text-lg font-bold text-foreground sm:hidden">
                        Timesheet
                    </h1>
                </div>

                <div className="flex items-center space-x-2 sm:space-x-4">
                    <div className="text-sm hidden sm:block">
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-muted-foreground capitalize">{user.role}</p>
                    </div>
                    <div className="text-xs sm:hidden">
                        <p className="font-medium text-foreground">{user.name}</p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={logout}
                        className="flex items-center sm:space-x-1 sm:space-x-2 border-border hover:bg-muted"
                    >
                        <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">Logout</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}
