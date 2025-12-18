import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LogOut, User, Settings, Sparkles, Check, Plus, Layout, ArrowLeftRight } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function BoardHeader({ user, onLogout, boards = [], activeBoard, onSwitchBoard, onCreateBoard, onUpdateBoard }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newBoardName, setNewBoardName] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(activeBoard?.name || "");

    useEffect(() => {
        if (activeBoard?.name) {
            setEditName(activeBoard.name);
        }
    }, [activeBoard]);

    const handleRename = async () => {
        if (!editName.trim() || editName === activeBoard?.name) {
            setEditName(activeBoard?.name || "");
            setIsEditing(false);
            return;
        }
        if (onUpdateBoard) {
            await onUpdateBoard(activeBoard.id, editName);
        }
        setIsEditing(false);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newBoardName.trim()) return;
        await onCreateBoard(newBoardName);
        setNewBoardName("");
        setIsCreateOpen(false);
    };

    return (
        <header className="border-b border-border/40 p-4 flex justify-between items-center bg-background/60 backdrop-blur-xl sticky top-0 z-50 px-6 sm:px-8 transition-all duration-300">
            <div className="flex items-center gap-3">
                <span className="font-heading font-black text-3xl tracking-tighter text-primary">cardio</span>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="h-12 px-6 rounded-full bg-primary/5 hover:bg-primary/10 border border-primary/10 group transition-all duration-300 gap-3"
                            >
                                {isEditing ? (
                                    <Input
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        onBlur={handleRename}
                                        onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                                        autoFocus
                                        className="h-8 w-32 bg-transparent border-none focus-visible:ring-0 p-0 font-bold text-sm text-[#8B8E6F] shadow-none"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                ) : (
                                    <span
                                        className="font-bold text-sm text-[#8B8E6F] hover:opacity-80 transition-opacity"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditName(activeBoard?.name || "");
                                            setIsEditing(true);
                                        }}
                                    >
                                        {activeBoard?.name || 'Main Board'}
                                    </span>
                                )}
                                <ArrowLeftRight className="w-4 h-4 text-[#8B8E6F] opacity-40 transition-all group-hover:opacity-100 group-hover:scale-110" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-64 mt-2 rounded-2xl border-border/50 shadow-2xl p-2 bg-card/95 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-500 ease-out" align="end">
                            <DropdownMenuLabel className="text-[11px] font-black tracking-widest text-[#8B8E6F] px-4 py-2 flex items-center gap-2">
                                <Layout className="w-3 h-3" /> Switch board
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="mx-2 bg-border/40" />
                            <div className="py-1">
                                {boards.map(board => (
                                    <DropdownMenuItem
                                        key={board.id}
                                        onClick={() => onSwitchBoard(board.id)}
                                        className="flex items-center justify-between rounded-xl h-11 px-4 m-1 focus:bg-primary/10 cursor-pointer group transition-all"
                                    >
                                        <span className={`text-sm transition-colors ${board.id === activeBoard?.id ? "font-bold text-primary" : "font-medium text-[#8B8E6F] group-hover:text-primary"
                                            }`}>
                                            {board.name || 'Untitled Board'}
                                        </span>
                                        {board.id === activeBoard?.id && <Check className="w-4 h-4 text-primary" />}
                                    </DropdownMenuItem>
                                ))}
                            </div>
                            <DropdownMenuSeparator className="mx-2 bg-border/40" />
                            <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="rounded-xl h-10 px-3 m-1 focus:bg-primary/5 cursor-pointer group"
                            >
                                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                                    <DialogTrigger asChild>
                                        <div className="flex items-center gap-3 w-full font-bold text-[#8B8E6F]/80 group-hover:text-[#8B8E6F] transition-colors">
                                            <div className="w-8 h-8 rounded-full bg-[#8B8E6F]/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#8B8E6F]/20 transition-all">
                                                <Plus className="w-4 h-4" />
                                            </div>
                                            Create new board
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent className="rounded-[2.5rem] border-primary/20 bg-background/95 backdrop-blur-2xl shadow-3xl">
                                        <DialogHeader>
                                            <DialogTitle className="text-3xl font-black tracking-tight font-heading">Create Board</DialogTitle>
                                            <DialogDescription className="font-medium text-muted-foreground">
                                                Add a new board to organize your tasks.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleCreate}>
                                            <div className="grid gap-4 py-8">
                                                <Input
                                                    id="name"
                                                    placeholder="E.g. Daily Standup"
                                                    value={newBoardName}
                                                    onChange={(e) => setNewBoardName(e.target.value)}
                                                    autoFocus
                                                    className="bg-background/50 border-border/40 focus-visible:ring-primary/30 h-14 rounded-2xl font-medium text-lg px-6"
                                                />
                                            </div>
                                            <DialogFooter>
                                                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl shadow-primary/20 rounded-2xl h-14 font-black transition-all hover:scale-[1.02]">Create Board</Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <Popover>
                        <PopoverTrigger asChild>
                            <Avatar className="h-9 w-9 cursor-pointer border-2 border-transparent hover:border-primary/20 hover:scale-105 transition-all shadow-sm ring-1 ring-border/50">
                                <AvatarImage src={user.picture} alt={user.name} />
                                <AvatarFallback className="bg-primary/10 text-primary font-bold">{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-2 mr-4 rounded-2xl border-border/50 shadow-2xl backdrop-blur-2xl bg-card/90" align="end">
                            <div className="px-3 py-3 border-b border-border/40 mb-2 flex items-center gap-3">
                                <Avatar className="h-10 w-10 border border-border/50">
                                    <AvatarImage src={user.picture} alt={user.name} />
                                    <AvatarFallback className="bg-primary/10 text-primary font-bold">{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-0.5">
                                    <div className="text-sm font-bold text-foreground leading-none">{user.name}</div>
                                    <div className="text-[11px] font-medium text-muted-foreground truncate max-w-[140px]">{user.email}</div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Button variant="ghost" size="sm" className="w-full justify-start gap-2 rounded-lg text-sm font-medium h-9">
                                    <User className="w-4 h-4 text-muted-foreground" /> Profile
                                </Button>
                                <Button variant="ghost" size="sm" className="w-full justify-start gap-2 rounded-lg text-sm font-medium h-9">
                                    <Settings className="w-4 h-4 text-muted-foreground" /> Settings
                                </Button>
                                <div className="h-px bg-border/40 my-1 mx-2" />
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start gap-2 rounded-lg text-sm font-medium h-9 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                                    onClick={onLogout}
                                >
                                    <LogOut className="w-4 h-4" /> Log out
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </header>
    );
}


