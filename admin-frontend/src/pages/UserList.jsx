
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminUsers } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy } from 'lucide-react';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        getAdminUsers().then(setUsers).catch(console.error);
    }, []);

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    const handleCopy = (text, label) => {
        navigator.clipboard.writeText(text);
        alert(`${label} copied: ${text}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Users</h2>
                <Input
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Users ({users.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Name</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Email</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Boards</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Role</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Action</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle font-medium">
                                            <div className="flex items-center gap-2">
                                                {user.name}
                                                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-50 hover:opacity-100" onClick={() => handleCopy(user.name, "Name")}>
                                                    <Copy className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center gap-2">
                                                {user.email}
                                                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-50 hover:opacity-100" onClick={() => handleCopy(user.email, "Email")}>
                                                    <Copy className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">{user.board_count}</td>
                                        <td className="p-4 align-middle">
                                            {user.is_admin ? <Badge>Admin</Badge> : <Badge variant="secondary">User</Badge>}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <Link to={`/users/${user.id}`}>
                                                <Button variant="outline" size="sm">View</Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default UserList;
