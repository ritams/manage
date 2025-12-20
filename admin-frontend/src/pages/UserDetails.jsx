
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAdminUserDetails } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const UserDetails = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => {
        getAdminUserDetails(id).then(setData).catch(console.error);
    }, [id]);

    if (!data) return <div>Loading...</div>;
    const { user, boards } = data;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link to="/users">
                    <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                </Link>
                <h2 className="text-3xl font-bold tracking-tight">User Details</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-medium">Name:</span>
                            <span>{user.name}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-medium">Email:</span>
                            <span>{user.email}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-medium">User ID:</span>
                            <span className="text-xs text-muted-foreground">{user.id}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-medium">Joined:</span>
                            <span>{new Date(user.created_at).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between pt-2">
                            <span className="font-medium">Role:</span>
                            {user.is_admin ? <Badge>Admin</Badge> : <Badge variant="secondary">User</Badge>}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Boards ({boards.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative w-full overflow-auto max-h-[300px]">
                            <table className="w-full text-sm text-left">
                                <thead className="text-muted-foreground bg-muted/50 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-2">Board Name</th>
                                        <th className="px-4 py-2">Role</th>
                                        <th className="px-4 py-2">Created</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {boards.map(board => (
                                        <tr key={board.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="px-4 py-2 font-medium">{board.name}</td>
                                            <td className="px-4 py-2 capitalize">{board.role}</td>
                                            <td className="px-4 py-2">{new Date(board.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {boards.length === 0 && <div className="p-4 text-center text-muted-foreground">No boards found.</div>}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default UserDetails;
