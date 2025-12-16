import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function BoardHeader({ user, onLogout }) {
    return (
        <header className="border-b border-border/40 p-4 flex justify-between items-center bg-background/60 backdrop-blur-xl sticky top-0 z-50 px-6 sm:px-8 transition-all duration-300">
            <div className="flex items-center gap-3 group cursor-pointer">
                <span className="font-heading font-bold text-3xl tracking-tight text-primary transition-all">Manage</span>
            </div>
            <div className="flex items-center gap-4">
                <ThemeToggle />
                <Popover>
                    <PopoverTrigger asChild>
                        <Avatar className="h-9 w-9 cursor-pointer border border-border/50 hover:ring-2 hover:ring-primary/20 transition-all">
                            <AvatarImage src={user.picture} alt={user.name} />
                            <AvatarFallback className="bg-primary/10 text-primary font-medium">{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-2 mr-4" align="end">
                        <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground border-b border-border/40 mb-1">
                            {user.name}
                            <div className="text-xs font-normal text-muted-foreground/70">{user.email}</div>
                        </div>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                            onClick={onLogout}
                        >
                            Log out
                        </Button>
                    </PopoverContent>
                </Popover>
            </div>
        </header>
    );
}
