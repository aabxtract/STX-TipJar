'use client';

import { useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

// Define a type for the user data we expect from Firestore
interface UserProfile {
  id: string;
  email: string;
  stacksAddress: string;
  isAdmin?: boolean;
}

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  // Memoize the query to prevent re-renders
  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'users'));
  }, [firestore]);

  const { data: users, isLoading: usersLoading, error: usersError } = useCollection<UserProfile>(usersQuery);

  const currentUserProfile = useMemo(() => {
    return users?.find(u => u.id === user?.uid);
  }, [users, user]);

  const isLoading = isUserLoading || usersLoading;
  
  if (!isLoading && (!user || !currentUserProfile?.isAdmin)) {
    router.push('/login'); // Redirect if not logged in or not an admin
    return null; 
  }
  
  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
          <CardDescription>View all registered users.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {usersError && (
             <div className="text-destructive-foreground bg-destructive/80 p-4 rounded-md">
                <p className="font-bold">Access Denied</p>
                <p className="text-sm">You do not have permission to view this page. Ensure you are logged in with an admin account.</p>
             </div>
          )}
          {!isLoading && !usersError && users && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Stacks Address</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.email}</TableCell>
                    <TableCell className="font-mono">{u.stacksAddress}</TableCell>
                    <TableCell>
                      {u.isAdmin && <Badge variant="destructive">Admin</Badge>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
