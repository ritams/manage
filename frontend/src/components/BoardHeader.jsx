import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LogOut, User, Settings, Sparkles } from "lucide-react";

export default function BoardHeader({ user, onLogout }) {
    return (
        <header className="border-b border-border/40 p-4 flex justify-between items-center bg-background/60 backdrop-blur-xl sticky top-0 z-50 px-6 sm:px-8 transition-all duration-300">
            <div className="flex items-center gap-3 group cursor-pointer">
                <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-3xl tracking-tight text-primary transition-all group-hover:tracking-normal">Manage</span>
                    <Badge variant="outline" className="hidden sm:flex h-5 px-1.5 text-[10px] font-bold uppercase tracking-widest border-primary/20 text-primary bg-primary/5">Pro</Badge>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border/50 text-xs font-semibold text-muted-foreground">
                    <Sparkles className="w-3 h-3 text-primary" />
                    Focus Mode Active
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

import { Badge } from "@/components/ui/badge";
