import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";
import SharePopover from "./ShareModal"; // It was renamed in content but file is still ShareModal.jsx
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LogOut, User, Settings, Check, Plus, Share2, ZoomIn, ZoomOut } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function BoardHeader({ user, onLogout, boards = [], activeBoard, onSwitchBoard, onCreateBoard, onUpdateBoard, isZoomedOut, onToggleZoom }) {
    const [newBoardName, setNewBoardName] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
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

        const name = newBoardName;
        // API call
        if (onCreateBoard) {
            await onCreateBoard(name);
        }
        setNewBoardName("");
        setIsCreating(false);
        document.body.click();
    };

    return (
        <header className="border-b border-border/40 p-4 flex justify-between items-center bg-background/60 backdrop-blur-xl sticky top-0 z-50 px-4 sm:px-8 transition-all duration-300">
            <div className="flex items-center gap-4">
                <span className="hidden md:inline font-heading font-black text-3xl tracking-tighter text-primary">cardio</span>
                <span className="inline md:hidden font-heading font-black text-3xl tracking-tighter text-primary">C</span>

                <div className="h-8 w-px bg-border/40" />

                <div className="flex items-center gap-2 md:gap-3">
                    {/* Inline Board Name Edit */}
                    <div className="group/board-title max-w-[120px] sm:max-w-xs md:max-w-md">
                        {isEditing ? (
                            <Input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                onBlur={handleRename}
                                onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                                autoFocus
                                className="h-9 w-full text-lg md:text-xl font-medium px-2 bg-background/50 border-primary/30 focus-visible:ring-primary/20 rounded-lg"
                            />
                        ) : (
                            <div
                                className="text-lg md:text-xl font-medium font-heading text-foreground/90 cursor-pointer py-1 transition-colors flex items-center gap-2 hover:text-primary truncate"
                                onClick={() => {
                                    setEditName(activeBoard?.name || "");
                                    setIsEditing(true);
                                }}
                            >
                                <span className="truncate">{activeBoard?.name || 'Untitled Board'}</span>
                            </div>
                        )}
                    </div>

                    {!isEditing && activeBoard && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onToggleZoom}
                                className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all shrink-0 md:hidden"
                            >
                                {isZoomedOut ? <ZoomIn className="w-4 h-4" /> : <ZoomOut className="w-4 h-4" />}
                            </Button>
                            <SharePopover boardId={activeBoard.id}>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all shrink-0"
                                >
                                    <Share2 className="w-4 h-4" />
                                </Button>
                            </SharePopover>
                        </>
                    )}

                    {!isEditing && (
                        <>
                            <div className="hidden sm:block h-5 w-px bg-border/60 mx-1" />

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-full bg-secondary/50 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all shrink-0"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-64 p-2 rounded-2xl bg-card/95 backdrop-blur-xl border-border/50 shadow-xl">
                                    <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground px-2 py-1.5 uppercase tracking-wider">
                                        Your Boards
                                    </DropdownMenuLabel>

                                    {boards.map(board => (
                                        <DropdownMenuItem
                                            key={board.id}
                                            onClick={() => onSwitchBoard(board.id)}
                                            className={cn(
                                                "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-colors mb-1",
                                                board.id === activeBoard?.id ? "bg-primary/10 text-primary" : "text-foreground/80 hover:bg-muted/50"
                                            )}
                                        >
                                            <span className="truncate">{board.name || 'Untitled'}</span>
                                            {board.id === activeBoard?.id && <Check className="w-4 h-4" />}
                                        </DropdownMenuItem>
                                    ))}

                                    <DropdownMenuSeparator className="my-2 bg-border/40" />

                                    <div className="pt-1">
                                        {isCreating ? (
                                            <form onSubmit={handleCreate} className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-3 p-1">
                                                <Input
                                                    autoFocus
                                                    placeholder="Board name..."
                                                    value={newBoardName}
                                                    onChange={(e) => setNewBoardName(e.target.value)}
                                                    onKeyDown={(e) => e.stopPropagation()}
                                                    className="bg-background/80 border-border/50 text-sm shadow-inner rounded-xl h-9 px-3 font-medium transition-all focus:border-primary/50"
                                                />
                                                <div className="flex items-center justify-between">
                                                    <div className="flex gap-2">
                                                        <Button type="submit" size="sm" className="h-7 text-[10px] bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 px-3 font-bold rounded-lg">Add Board</Button>
                                                        <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-[10px] font-bold rounded-lg" onClick={(e) => { e.preventDefault(); setIsCreating(false); }}>Cancel</Button>
                                                    </div>
                                                </div>
                                            </form>
                                        ) : (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-primary/5 h-9 text-xs font-bold rounded-xl border border-transparent hover:border-primary/10 transition-all group/add"
                                                onClick={(e) => { e.preventDefault(); setIsCreating(true); }}
                                            >
                                                <div className="w-5 h-5 rounded-full bg-secondary/80 flex items-center justify-center mr-2 group-hover/add:bg-primary/10 group-hover/add:text-primary transition-colors">
                                                    <Plus className="h-3 w-3" />
                                                </div>
                                                <span>New Board</span>
                                            </Button>
                                        )}
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    )}
                </div>
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
        </header >
    );
}
