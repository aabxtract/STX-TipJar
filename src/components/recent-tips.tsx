import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { type Tip } from '@/lib/stacks';
import { truncateAddress } from '@/lib/utils';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar';
import { Badge } from './ui/badge';
import { ArrowRight, MessageSquare } from 'lucide-react';

interface RecentTipsProps {
  tips: Tip[];
}

export function RecentTips({ tips }: RecentTipsProps) {
  if (tips.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed">
        <p className="text-muted-foreground">No tips found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="hidden md:table-cell text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tips.map((tip) => (
            <TableRow key={tip.txId}>
              <TableCell>
                <div className="flex items-start gap-3">
                    <div className="flex items-center gap-3 mt-1 shrink-0">
                        <Link href={`/address/${tip.sender}`} className="hover:underline">
                            <Avatar className="h-8 w-8">
                            <AvatarFallback>{tip.sender.substring(2,4)}</AvatarFallback>
                            </Avatar>
                        </Link>
                        <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0"/>
                        <Link href={`/address/${tip.recipient}`} className="hover:underline">
                            <Avatar className="h-8 w-8">
                            <AvatarFallback>{tip.recipient.substring(2,4)}</AvatarFallback>
                            </Avatar>
                        </Link>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <div className="text-sm font-medium flex items-center gap-2 flex-wrap">
                            <Link href={`/address/${tip.sender}`} className="hover:underline hidden sm:inline-block break-all">{truncateAddress(tip.sender)}</Link>
                            <span className="sm:hidden">sent to</span>
                            <Link href={`/address/${tip.recipient}`} className="hover:underline hidden sm:inline-block break-all">{truncateAddress(tip.recipient)}</Link>
                        </div>
                        {tip.message && (
                            <div className="text-sm text-muted-foreground flex items-start gap-2 p-2 rounded-md bg-muted/50 border">
                                <MessageSquare className="h-4 w-4 mt-0.5 shrink-0" />
                                <p className="leading-snug">{tip.message}</p>
                            </div>
                        )}
                        <div className="text-xs text-muted-foreground sm:hidden">
                            {formatDistanceToNow(tip.timestamp, { addSuffix: true })}
                        </div>
                    </div>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Badge variant="secondary" className="font-mono">{tip.amount.toLocaleString()} STX</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell text-right text-muted-foreground">
                {formatDistanceToNow(tip.timestamp, { addSuffix: true })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
