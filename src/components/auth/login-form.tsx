'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { loginSchema, type LoginFormData } from '@/lib/validations';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

export function LoginForm() {
    const [error, setError] = useState<string>('');
    const { login } = useAuthStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const mutation = useMutation({
        mutationFn: authAPI.login,
        onSuccess: (user) => {
            login(user);
            setError('');
        },
        onError: (error: Error) => {
            setError(error.message);
        },
    });

    const onSubmit = (data: LoginFormData) => {
        mutation.mutate(data);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-xl dashboard-card-blue">
                        <Clock className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-foreground">
                        Timesheet Manager
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Sign in to your account
                    </p>
                </div>

                <Card className="bg-card border-border glass-effect">
                    <CardHeader>
                        <CardTitle className="text-foreground">Login</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Enter your credentials to access your timesheet
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <Label htmlFor="email" className="text-foreground">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    {...register('email')}
                                    className="mt-1 bg-input border-border text-foreground"
                                    placeholder="Enter your email"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="password" className="text-foreground">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    {...register('password')}
                                    className="mt-1 bg-input border-border text-foreground"
                                    placeholder="Enter your password"
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
                                )}
                            </div>

                            {error && (
                                <div className="text-sm text-white bg-destructive p-3 rounded-md">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full dashboard-card-blue hover:opacity-90 transition-opacity"
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending ? 'Signing in...' : 'Sign in'}
                            </Button>
                        </form>

                        <div className="mt-6 text-xs text-muted-foreground bg-muted p-4 rounded-lg">
                            <p className="font-medium text-foreground">Demo Accounts:</p>
                            <p>Manager: manager@company.com</p>
                            <p>Associate: associate1@company.com</p>
                            <p>Associate: associate2@company.com</p>
                            <p className="mt-2 italic">Use any password</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
