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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
                        <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Timesheet Manager
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to your account
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Login</CardTitle>
                        <CardDescription>
                            Enter your credentials to access your timesheet
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    {...register('email')}
                                    className="mt-1"
                                    placeholder="Enter your email"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    {...register('password')}
                                    className="mt-1"
                                    placeholder="Enter your password"
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                                )}
                            </div>

                            {error && (
                                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending ? 'Signing in...' : 'Sign in'}
                            </Button>
                        </form>

                        <div className="mt-6 text-xs text-gray-500">
                            <p className="font-medium">Demo Accounts:</p>
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
