import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";
import SharePopover from "./ShareModal";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LogOut, User, Settings, Check, Plus, Share2, ChevronDown, Search, X, LayoutGrid, Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

export default function BoardHeader({ user, onLogout, boards = [], activeBoard, onSwitchBoard, onCreateBoard, onUpdateBoard, onDeleteBoard, isZoomedOut, onToggleZoom }) {
    const [newBoardName, setNewBoardName] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [editName, setEditName] = useState(activeBoard?.name || "");
    const [isBoardPickerOpen, setIsBoardPickerOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [deletingBoard, setDeletingBoard] = useState(null);
    const searchInputRef = useRef(null);

    useEffect(() => {
        if (activeBoard?.name) {
            setEditName(activeBoard.name);
        }
    }, [activeBoard]);

    // Focus search when picker opens
    useEffect(() => {
        if (isBoardPickerOpen && searchInputRef.current && boards.length > 3) {
            setTimeout(() => searchInputRef.current?.focus(), 100);
        }
        if (!isBoardPickerOpen) {
            setSearchQuery("");
            setIsCreating(false);
        }
    }, [isBoardPickerOpen, boards.length]);

    // Filter boards by search
    const filteredBoards = useMemo(() => {
        if (!searchQuery.trim()) return boards;
        return boards.filter(b =>
            b.name?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [boards, searchQuery]);

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
        if (onCreateBoard) {
            await onCreateBoard(newBoardName);
        }
        setNewBoardName("");
        setIsCreating(false);
        setIsBoardPickerOpen(false);
    };

    const handleSwitchBoard = (boardId) => {
        onSwitchBoard(boardId);
        setIsBoardPickerOpen(false);
    };

    const handleQuickCreate = async () => {
        const name = `Board ${boards.length + 1}`;
        if (onCreateBoard) {
            await onCreateBoard(name);
        }
    };

    const handleDeleteBoard = async (e, board) => {
        e.stopPropagation();
        setDeletingBoard(board);
    };

    const confirmDeleteBoard = async () => {
        if (deletingBoard && onDeleteBoard) {
            await onDeleteBoard(deletingBoard.id);
        }
        setDeletingBoard(null);
    };

    return (
        <header className="border-b border-border/40 p-3 sm:p-4 flex justify-between items-center bg-background/60 backdrop-blur-xl sticky top-0 z-50 px-3 sm:px-8 transition-all duration-300">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                {/* Logo */}
                <span className="hidden md:inline font-heading font-black text-2xl tracking-tighter text-primary shrink-0">cardio</span>
                <span className="inline md:hidden font-heading font-black text-2xl tracking-tighter text-primary shrink-0">C</span>

                <div className="hidden sm:block h-6 w-px bg-border/40 shrink-0" />

                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    {/* Board Selector - New Pattern */}
                    {isEditing ? (
                        <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onBlur={handleRename}
                            onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                            autoFocus
                            className="h-8 sm:h-9 w-32 sm:w-48 text-sm sm:text-base font-medium px-2 bg-background/50 border-primary/30 focus-visible:ring-primary/20 rounded-lg"
                        />
                    ) : (
                        <Popover open={isBoardPickerOpen} onOpenChange={setIsBoardPickerOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "h-8 sm:h-9 px-2 sm:px-3 gap-1 sm:gap-1.5 text-sm sm:text-base font-medium rounded-xl transition-all max-w-[140px] sm:max-w-[200px]",
                                        "hover:bg-primary/5 hover:text-primary",
                                        isBoardPickerOpen && "bg-primary/10 text-primary"
                                    )}
                                >
                                    <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary/70 shrink-0" />
                                    <span className="truncate">{activeBoard?.name || 'Select Board'}</span>
                                    <ChevronDown className={cn(
                                        "w-3.5 h-3.5 text-muted-foreground transition-transform shrink-0",
                                        isBoardPickerOpen && "rotate-180"
                                    )} />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-72 sm:w-80 p-0 rounded-2xl bg-card/98 backdrop-blur-2xl border-border/50 shadow-2xl overflow-hidden"
                                align="start"
                                sideOffset={8}
                            >
                                {/* Search Bar - Shows when 4+ boards */}
                                {boards.length > 3 && (
                                    <div className="p-2 border-b border-border/30">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                ref={searchInputRef}
                                                placeholder="Search boards..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-9 pr-8 h-9 text-sm bg-background/50 border-border/40 rounded-xl"
                                            />
                                            {searchQuery && (
                                                <button
                                                    onClick={() => setSearchQuery("")}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full hover:bg-muted flex items-center justify-center"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Board List */}
                                <div className="p-2 max-h-64 overflow-y-auto">
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2 py-1.5 mb-1">
                                        Your Boards
                                    </div>
                                    {filteredBoards.length === 0 ? (
                                        <div className="text-center py-6 text-sm text-muted-foreground">
                                            No boards found
                                        </div>
                                    ) : (
                                        <div className="space-y-0.5">
                                            {filteredBoards.map(board => (
                                                <div
                                                    key={board.id}
                                                    className={cn(
                                                        "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all group",
                                                        board.id === activeBoard?.id
                                                            ? "bg-primary/10 text-primary"
                                                            : "text-foreground/80 hover:bg-muted/50"
                                                    )}
                                                    onClick={() => handleSwitchBoard(board.id)}
                                                    onDoubleClick={() => {
                                                        setIsBoardPickerOpen(false);
                                                        setTimeout(() => setIsEditing(true), 100);
                                                    }}
                                                >
                                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                                        <div className={cn(
                                                            "w-2 h-2 rounded-full shrink-0",
                                                            board.id === activeBoard?.id ? "bg-primary" : "bg-muted-foreground/30"
                                                        )} />
                                                        <span className="truncate">{board.name || 'Untitled'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 shrink-0">
                                                        {board.id === activeBoard?.id && (
                                                            <Check className="w-4 h-4" />
                                                        )}
                                                        {/* Delete button - only show if more than 1 board */}
                                                        {boards.length > 1 && (
                                                            <button
                                                                onClick={(e) => handleDeleteBoard(e, board)}
                                                                className="w-6 h-6 rounded-md flex items-center justify-center transition-all ml-1 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                                                                title="Delete board"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Delete Confirmation Dialog */}
                                <AlertDialog open={!!deletingBoard} onOpenChange={(open) => !open && setDeletingBoard(null)}>
                                    <AlertDialogContent className="rounded-2xl">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete this board?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will permanently remove "{deletingBoard?.name}" and all its collections and tasks. This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel className="rounded-xl font-bold">Nevermind</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={confirmDeleteBoard}
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl font-bold"
                                            >
                                                Delete Everything
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>

                                {/* Create Board Section */}
                                <div className="border-t border-border/30 p-2">
                                    {isCreating ? (
                                        <form onSubmit={handleCreate} className="space-y-2 p-1">
                                            <Input
                                                autoFocus
                                                placeholder="Board name..."
                                                value={newBoardName}
                                                onChange={(e) => setNewBoardName(e.target.value)}
                                                onKeyDown={(e) => e.stopPropagation()}
                                                className="h-9 text-sm bg-background/60 border-border/50 rounded-xl font-medium"
                                            />
                                            <div className="flex gap-2">
                                                <Button
                                                    type="submit"
                                                    size="sm"
                                                    className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 px-4 font-bold rounded-lg flex-1"
                                                >
                                                    Create
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 px-3 text-xs font-medium rounded-lg"
                                                    onClick={() => setIsCreating(false)}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </form>
                                    ) : (
                                        <button
                                            onClick={() => setIsCreating(true)}
                                            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors group"
                                        >
                                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                <Plus className="w-3 h-3 text-primary" />
                                            </div>
                                            <span>Create new board</span>
                                        </button>
                                    )}
                                </div>

                                {/* Keyboard hint - Desktop only */}
                                <div className="hidden sm:flex items-center justify-center gap-1.5 py-2 border-t border-border/20 text-[10px] text-muted-foreground/60">
                                    <span>Double-click board to rename</span>
                                </div>
                            </PopoverContent>
                        </Popover >
                    )
                    }

                    {/* Quick Create Button - Desktop only */}
                    {
                        !isEditing && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleQuickCreate}
                                className="hidden sm:flex h-8 px-2.5 gap-1 rounded-lg text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span className="hidden md:inline">New</span>
                            </Button>
                        )
                    }

                    {/* Share Button */}
                    {
                        !isEditing && activeBoard && (
                            <>
                                <div className="hidden sm:block h-5 w-px bg-border/40 mx-0.5" />
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
                        )
                    }
                </div >
            </div >

            {/* Right side actions */}
            <div className="flex items-center gap-2 sm:gap-3">
                <ThemeToggle />
                <Popover>
                    <PopoverTrigger asChild>
                        <Avatar className="h-8 w-8 sm:h-9 sm:w-9 cursor-pointer border-2 border-transparent hover:border-primary/20 hover:scale-105 transition-all shadow-sm ring-1 ring-border/50">
                            <AvatarImage src={user.picture} alt={user.name} />
                            <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-2 mr-2 sm:mr-4 rounded-2xl border-border/50 shadow-2xl backdrop-blur-2xl bg-card/90" align="end">
                        <div className="px-3 py-3 border-b border-border/40 mb-2 flex items-center gap-3">
                            <Avatar className="h-10 w-10 border border-border/50">
                                <AvatarImage src={user.picture} alt={user.name} />
                                <AvatarFallback className="bg-primary/10 text-primary font-bold">{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-0.5 min-w-0">
                                <div className="text-sm font-bold text-foreground leading-none truncate">{user.name}</div>
                                <div className="text-[11px] font-medium text-muted-foreground truncate">{user.email}</div>
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
            </div >
        </header >
    );
}
