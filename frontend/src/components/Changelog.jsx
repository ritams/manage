import { Badge } from "@/components/ui/badge";
import { Rocket, Package, Sparkles, Star, GitBranch, Terminal, Layout } from "lucide-react";

export default function Changelog() {
    return (
        <div className="min-h-screen pt-24 pb-20 px-6 max-w-3xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <header className="space-y-4 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium border border-border mb-2">
                    <Rocket className="w-4 h-4" />
                    <span>Evolution</span>
                </div>
                <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">Changelog</h1>
                <p className="text-xl text-muted-foreground">The journey of building the ultimate workspace.</p>
            </header>

            <div className="relative ml-4 md:ml-0">
                {/* Timeline Line */}
                <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary via-primary/50 to-transparent transform -translate-x-1/2 hidden md:block"></div>

                <div className="space-y-12 relative">
                    {/* Entry 1 */}
                    <div className="relative grid md:grid-cols-2 gap-8 items-start">
                        {/* Desktop: Version info on the left, card on the right */}
                        <div className="flex flex-col md:items-end md:text-right space-y-2 pt-2">
                            <div className="flex items-center md:flex-row-reverse gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 z-10 relative">
                                    <Star className="w-5 h-5 fill-current" />
                                </div>
                                <Badge variant="default" className="w-fit bg-primary hover:bg-primary shadow-sm">v1.0.0</Badge>
                            </div>
                            <span className="text-sm font-semibold text-muted-foreground ml-12 md:ml-0">December 16, 2025</span>
                        </div>

                        <div className="p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow group relative">
                            {/* Mobile timeline marker */}
                            <div className="absolute left-[-21px] top-6 w-5 h-5 rounded-full border-4 border-background bg-primary md:hidden"></div>

                            <h2 className="text-xl font-bold text-foreground mb-4 font-heading flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-primary" />
                                Initial Release
                            </h2>
                            <ul className="space-y-3 text-muted-foreground">
                                <li className="flex gap-3">
                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0"></div>
                                    <span>Launched Manage with Board, List, and Card functionality.</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0"></div>
                                    <span>Implemented smooth drag and drop using dnd-kit.</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0"></div>
                                    <span>Integrated secure Google Authentication.</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0"></div>
                                    <span>Introduced the refined "Olive" theme architecture.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Future placeholder or next entry */}
                    <div className="flex justify-center md:pt-8 opacity-50">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-px h-12 bg-border"></div>
                            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">More to come</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tech Stack Footer */}
            <footer className="pt-20 border-t border-border/50 text-center">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-6 flex items-center justify-center gap-2">
                    <Terminal className="w-4 h-4" />
                    Built with modern tech
                </h3>
                <div className="flex flex-wrap justify-center gap-4 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                    <Badge variant="outline" className="px-4 py-1.5 text-sm font-medium flex items-center gap-2">
                        <Package className="w-3.5 h-3.5" /> React 19
                    </Badge>
                    <Badge variant="outline" className="px-4 py-1.5 text-sm font-medium flex items-center gap-2">
                        <GitBranch className="w-3.5 h-3.5" /> Vite
                    </Badge>
                    <Badge variant="outline" className="px-4 py-1.5 text-sm font-medium flex items-center gap-2">
                        <Layout className="w-3.5 h-3.5" /> Tailwind CSS
                    </Badge>
                </div>
            </footer>
        </div>
    );
}
