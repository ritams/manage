
import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getMe, logout } from '@/lib/api';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const userData = await getMe();
            // Basic client-side check, real check is on API
            // Ideally we'd have an 'isAdmin' flag in the JWT or /me response
            // For now, we assume if they can hit /admin/stats, they are admin.
            // But let's rely on api interceptor for redirect.
            setUser(userData);
        } catch (e) {
            console.error("Not authenticated", e);
            navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

    return (
        <div className="flex h-screen bg-background text-foreground">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border bg-card p-4 flex flex-col">
                <div className="mb-8">
                    <h1 className="text-xl font-bold font-heading text-primary">Admin Panel</h1>
                </div>

                <nav className="flex-1 space-y-2">
                    <Link to="/">
                        <Button variant={location.pathname === '/' ? 'secondary' : 'ghost'} className="w-full justify-start">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard
                        </Button>
                    </Link>
                    <Link to="/users">
                        <Button variant={location.pathname.startsWith('/users') ? 'secondary' : 'ghost'} className="w-full justify-start">
                            <Users className="mr-2 h-4 w-4" />
                            Users
                        </Button>
                    </Link>
                </nav>

                <div className="mt-auto pt-4 border-t border-border">
                    <div className="flex items-center gap-2 mb-4 px-2">
                        {user?.picture && <img src={user.picture} alt="Avatar" className="w-8 h-8 rounded-full" />}
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">{user?.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
