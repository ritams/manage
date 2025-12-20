
import React, { useEffect, useState } from 'react';
import { getAdminStats } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Layout, List, FileText } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className={`h-4 w-4 text-${color}-500`} />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

const Dashboard = () => {
    const [stats, setStats] = useState({ users: 0, boards: 0, lists: 0, cards: 0 });

    useEffect(() => {
        getAdminStats().then(setStats).catch(console.error);
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Users" value={stats.users} icon={Users} color="blue" />
                <StatCard title="Total Boards" value={stats.boards} icon={Layout} color="green" />
                <StatCard title="Total Lists" value={stats.lists} icon={List} color="yellow" />
                <StatCard title="Total Cards" value={stats.cards} icon={FileText} color="red" />
            </div>
        </div>
    );
};

export default Dashboard;
