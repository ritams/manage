import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { X, Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export default function SharePopover({ boardId, children }) {
    const [email, setEmail] = useState('');
    const [members, setMembers] = useState([]);
    const [error, setError] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isOpen && boardId) {
            loadMembers();
        }
    }, [isOpen, boardId]);

    const loadMembers = async () => {
        try {
            const data = await api.boards.getMembers(boardId);
            setMembers(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.boards.addMember(boardId, email);
            setEmail('');
            loadMembers();
        } catch (err) {
            let msg = 'Failed to invite';
            try {
                const json = JSON.parse(err.message);
                if (json.error) msg = json.error;
            } catch (e) {
                if (err.message.includes('User not found')) msg = 'User not found';
                else if (err.message.includes('already member')) msg = 'User already a member';
            }
            setError(msg);
        }
    };

    const handleRemove = async (userId) => {
        try {
            await api.boards.removeMember(boardId, userId);
            loadMembers();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent align="start" className="w-80 p-4 rounded-2xl bg-card/95 backdrop-blur-xl border-border/50 shadow-xl">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Share Board</h2>

                <form onSubmit={handleAdd} className="flex gap-2 mb-4">
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Email address..."
                        className="flex-1 h-8 text-sm px-2 bg-background/80 border border-border/50 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50"
                        required
                    />
                    <Button type="submit" size="sm" className="h-8 px-3 bg-primary text-primary-foreground text-xs font-bold rounded-lg shadow-sm">
                        Invite
                    </Button>
                </form>
                {error && <p className="text-red-500 mb-3 text-xs font-medium">{error}</p>}

                <div className="space-y-3">
                    <h3 className="font-semibold text-[10px] text-muted-foreground uppercase tracking-wider">Members</h3>
                    <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                        {members.map(m => (
                            <div key={m.id} className="flex justify-between items-center p-2 hover:bg-muted/50 rounded-lg transition-colors group">
                                <div className="flex flex-col overflow-hidden mr-2">
                                    <span className="text-sm font-medium text-foreground truncate">{m.name || m.email.split('@')[0]}</span>
                                    <span className="text-[10px] text-muted-foreground truncate">{m.email}</span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase ${m.role === 'owner' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                                        {m.role}
                                    </span>
                                    {m.role !== 'owner' && (
                                        <button
                                            onClick={() => handleRemove(m.id)}
                                            className="text-muted-foreground hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                                            title="Remove member"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
