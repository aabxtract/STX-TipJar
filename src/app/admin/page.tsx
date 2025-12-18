'use client';

import { useMemo, useEffect, useState } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, doc } from 'firebase/firestore';
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
  const [permissionChecked, setPermissionChecked] = useState(false);

  // Memoize the document reference for the current user's profile
  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: currentUserProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

  // Memoize the query to fetch all users.
  // CRITICAL: Only run the query if we know the user is an admin.
  const usersQuery = useMemoFirebase(() => {
    if (!firestore || !permissionChecked || !currentUserProfile?.isAdmin) return null;
    return query(collection(firestore, 'users'));
  }, [firestore, permissionChecked, currentUserProfile]);

  const { data: users, isLoading: usersLoading, error: usersError } = useCollection<UserProfile>(usersQuery);

  useEffect(() => {
    if (isUserLoading || isProfileLoading) return; // Wait for auth and profile to load

    if (!user) {
      router.push('/login'); // Not logged in, redirect
      return;
    }

    if (currentUserProfile) {
      if (!currentUserProfile.isAdmin) {
        // We know the user is not an admin, so we can show an error without querying all users.
        console.error("Access denied: User is not an admin.");
      }
      setPermissionChecked(true); // Permission status is now known, allow the usersQuery to run (or not)
    }
  }, [user, isUserLoading, currentUserProfile, isProfileLoading, router]);
  
  const isLoading = isUserLoading || isProfileLoading || (permissionChecked && usersLoading);
  
  if (!permissionChecked && !isLoading) {
    // This state can occur briefly before the useEffect runs or if there's a problem fetching the profile.
    return (
        <div className="container mx-auto max-w-4xl py-8 px-4">
            <Card>
                <CardHeader>
                    <CardTitle>Admin Dashboard</CardTitle>
                    <CardDescription>Verifying permissions...</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center items-center h-48">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
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
          
          {!isLoading && (!currentUserProfile?.isAdmin || usersError) && (
             <div className="text-destructive-foreground bg-destructive/80 p-4 rounded-md">
                <p className="font-bold">Access Denied</p>
                <p className="text-sm">You do not have permission to view this page. Ensure you are logged in with an admin account.</p>
             </div>
          )}

          {!isLoading && currentUserProfile?.isAdmin && !usersError && users && (
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
                      {u.isAdmin ? <Badge variant="destructive">Admin</Badge> : <Badge variant="secondary">User</Badge>}
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
