'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/contexts/wallet-context';
import { useToast } from '@/hooks/use-toast';
import { sendTip } from '@/lib/stacks';

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
import { Send, Loader2 } from 'lucide-react';

const STX_ADDRESS_REGEX = /^[SMNPQRS]{1}[0-9A-HJ-NP-Z]{33,39}$/;

const tipFormSchema = z.object({
  recipient: z.string().regex(STX_ADDRESS_REGEX, 'Please enter a valid Stacks address.'),
  amount: z.coerce.number().positive('Amount must be greater than 0.'),
});

type TipFormValues = z.infer<typeof tipFormSchema>;

export function TipForm() {
  const router = useRouter();
  const { isConnected, userAddress } = useWallet();
  const { toast } = useToast();

  const form = useForm<TipFormValues>({
    resolver: zodResolver(tipFormSchema),
    defaultValues: {
      recipient: '',
      amount: 0,
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: TipFormValues) {
    if (!userAddress) {
      toast({ variant: 'destructive', title: 'Wallet not connected' });
      return;
    }

    if (values.recipient === userAddress) {
      toast({ variant: 'destructive', title: 'You cannot tip yourself!' });
      return;
    }

    try {
      await sendTip({
        sender: userAddress,
        recipient: values.recipient,
        amount: values.amount,
      });

      toast({
        title: 'Tip Sent!',
        description: `You successfully sent ${values.amount} STX to ${values.recipient.substring(0, 10)}...`,
      });
      form.reset();
      router.refresh(); // Refresh server components to show the new tip
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Transaction Failed',
        description: 'Something went wrong. Please try again.',
      });
    }
  }

  return (
    <Card className="border-2 border-accent">
      <CardHeader>
        <CardTitle>Create a Tip</CardTitle>
        <CardDescription>Enter recipient address and amount.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="recipient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient Address</FormLabel>
                  <FormControl>
                    <Input placeholder="SP2J6B...A4020JT" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (STX)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.000001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={!isConnected || isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              {isConnected ? (isSubmitting ? 'Sending...' : 'Send Tip') : 'Connect Wallet to Tip'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
