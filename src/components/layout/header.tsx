'use client';

import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { LogOut, Clock } from 'lucide-react';

export function Header() {
    const { user, logout } = useAuthStore();

    if (!user) return null;

    return (
        <header className="border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg dashboard-card-blue">
                        <Clock className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-foreground">Timesheet Manager</h1>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="text-sm">
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-muted-foreground capitalize">{user.role}</p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={logout}
                        className="flex items-center space-x-2 border-border hover:bg-muted"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}
