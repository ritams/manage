import { Sparkles, Zap, ShieldCheck, Heart, Layout, MousePointer2 } from "lucide-react";

export default function About() {
    return (
        <div className="min-h-screen pt-24 pb-20 px-6 max-w-5xl mx-auto space-y-20 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Hero Section */}
            <section className="text-center space-y-6 py-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 mb-4">
                    <Sparkles className="w-4 h-4" />
                    <span>Meet Manage</span>
                </div>
                <h1 className="font-heading text-5xl md:text-6xl font-extrabold text-foreground tracking-tight">
                    Calm tools for <span className="text-primary italic">focused</span> teams.
                </h1>
                <p className="max-w-2xl mx-auto text-xl text-muted-foreground leading-relaxed">
                    Manage is designed to be the simplest, most elegant project management tool.
                    We believe your tools should empower you, not distract you.
                </p>
            </section>

            {/* Philosophy Grid */}
            <section className="grid md:grid-cols-3 gap-8">
                <div className="group p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-xl transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                        <Zap className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 font-heading">Speed over complexity</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        We prioritize lightning-fast interactions and intuitive flows so you can spend less time managing and more time doing.
                    </p>
                </div>

                <div className="group p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-xl transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                        <Layout className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 font-heading">Simplicity by design</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        Every feature is carefully considered. If it doesn't add value to your daily workflow, it doesn't make the cut.
                    </p>
                </div>

                <div className="group p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-xl transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 font-heading">Calm and Quiet</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        No notification spam or dark patterns. Manage respect your focus and provides a serene environment for your thoughts.
                    </p>
                </div>
            </section>

            {/* Secondary Content */}
            <section className="bg-primary/5 rounded-3xl p-8 md:p-12 border border-primary/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 -m-12 opacity-10">
                    <Sparkles className="w-64 h-64 text-primary" />
                </div>
                <div className="max-w-2xl relative z-10 space-y-6">
                    <h2 className="text-3xl font-bold font-heading">Our natural flow approach</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Traditional tools often feel like chores. Manage is built with a focus on <strong>natural flow</strong>,
                        adapting to how you think and move. It's not just a tracker; it's a workspace that grows with you.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-4">
                        <span className="flex items-center gap-2 text-sm font-medium text-foreground bg-background px-4 py-2 rounded-full border border-border shadow-sm">
                            <MousePointer2 className="w-4 h-4 text-primary" /> Natural Interactions
                        </span>
                        <span className="flex items-center gap-2 text-sm font-medium text-foreground bg-background px-4 py-2 rounded-full border border-border shadow-sm">
                            <Heart className="w-4 h-4 text-primary" /> Built with Love
                        </span>
                    </div>
                </div>
            </section>
        </div>
    );
}
