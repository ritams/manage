import { Badge } from "@/components/ui/badge";

export default function Changelog() {
    return (
        <div className="min-h-screen pt-24 pb-12 px-6 max-w-3xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-500">
            <header className="space-y-4">
                <h1 className="font-heading text-4xl font-bold text-foreground">Changelog</h1>
                <p className="text-xl text-muted-foreground">New updates and improvements to Manage.</p>
            </header>

            <div className="space-y-12 relative border-l border-border/50 ml-3 pl-8">
                {/* Entry 1 */}
                <div className="relative">
                    <span className="absolute -left-[39px] top-1 h-5 w-5 rounded-full border-4 border-background bg-primary"></span>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
                        <Badge variant="outline" className="w-fit border-primary/20 text-primary bg-primary/5">v1.0.0</Badge>
                        <span className="text-sm text-muted-foreground">December 16, 2025</span>
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-3 font-heading">Initial Release</h2>
                    <ul className="space-y-2 text-muted-foreground list-disc pl-4">
                        <li>Launched Manage with Board, List, and Card functionality.</li>
                        <li>Implemented drag and drop using dnd-kit.</li>
                        <li>Added Google Authentication.</li>
                        <li>Introduced "Olive" theme with light and dark modes.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
