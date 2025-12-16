'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, UserPlus } from 'lucide-react';

const signUpFormSchema = z
  .object({
    email: z.string().email('Please enter a valid email address.'),
    password: z.string().min(8, 'Password must be at least 8 characters long.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignUpFormValues = z.infer<typeof signUpFormSchema>;

export default function SignUpPage() {
  const { toast } = useToast();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: SignUpFormValues) {
    // Mock sign up logic
    console.log(values);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({
      title: 'Account Created!',
      description: 'You have successfully signed up.',
    });
    form.reset();
  }

  return (
    <div className="container mx-auto max-w-md py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>Sign up to create your own STX TipJar.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="mr-2 h-4 w-4" />
                )}
                {isSubmitting ? 'Signing up...' : 'Sign Up'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-center mt-4">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="underline hover:text-primary">
            Log in
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
