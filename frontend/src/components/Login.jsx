import { useEffect } from "react";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import {
    Sparkles,
    CheckCircle2,
    Zap,
    BarChart3,
    Users,
    Target,
    Shield,
    Infinity as InfinityIcon,
    Terminal,
    Github,
    Twitter,
    Layout,
    ArrowRight,
    Star
} from "lucide-react";
import About from "./About";
import Changelog from "./Changelog";
import ThemeToggle from "./ThemeToggle";

export default function Login({ onLogin, currentView, setCurrentView }) {
    useEffect(() => {
        /* global google */
        if (typeof google !== "undefined") {
            try {
                google.accounts.id.initialize({
                    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                    callback: async (res) => {
                        try {
                            const data = await api.auth.google(res.credential);
                            onLogin(data.user);
                        } catch (e) {
                            console.error("Login failed:", e);
                        }
                    },
                });

                google.accounts.id.renderButton(
                    document.getElementById("google-login-btn-overlay"),
                    { theme: "outline", size: "large", type: "standard", shape: "pill", width: 300 }
                );
            } catch (err) {
                console.error("Google auth init error", err);
            }
        }
    }, [onLogin]);

    const renderLandingContent = () => (
        <div className="flex flex-col">
            {/* Hero Section */}
            <main className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 pt-20 pb-12 overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] -z-10 animate-pulse delay-1000"></div>

                <div className="container max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 z-10">
                    <div className="flex-1 space-y-8 animate-in slide-in-from-left-10 fade-in duration-1000">
                        <Badge variant="secondary" className="px-4 py-1.5 text-sm font-semibold bg-primary/10 text-primary border-primary/20 backdrop-blur-md">
                            <Sparkles className="w-4 h-4 mr-2 fill-primary/30" />
                            Manage v1.0 is now live
                        </Badge>

                        <h1 className="font-heading text-6xl md:text-8xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                            Focus on the <br />
                            <span className="text-primary italic relative">
                                work
                                <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/20 -z-10" viewBox="0 0 100 12" preserveAspectRatio="none">
                                    <path d="M0,10 Q50,0 100,10" stroke="currentColor" strokeWidth="8" fill="none" />
                                </svg>
                            </span> that matters.
                        </h1>

                        <p className="text-2xl text-muted-foreground leading-relaxed max-w-xl">
                            The calm, elegant workspace designed for high-performing teams who value clarity over noise.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                            {/* Custom Google Button Container */}
                            <div className="relative group">
                                <div className="flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl shadow-primary/20">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    <span className="text-lg">Get Started with Google</span>
                                </div>
                                <div id="google-login-btn-overlay" className="absolute inset-0 opacity-0 cursor-pointer overflow-hidden z-20 transform scale-150 origin-top-left"></div>
                            </div>

                            <button onClick={() => setCurrentView("about")} className="group flex items-center gap-2 text-lg font-semibold text-muted-foreground hover:text-foreground transition-colors">
                                Learn about our philosophy
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>

                        <div className="pt-8 flex items-center gap-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className={`w-10 h-10 rounded-full border-2 border-background bg-zinc-200 flex items-center justify-center overflow-hidden shadow-sm z-${10 - i}`}>
                                        <div className={`w-full h-full bg-gradient-to-br from-primary/${20 + i * 15} to-primary/${40 + i * 15}`} />
                                    </div>
                                ))}
                            </div>
                            <div className="text-sm text-muted-foreground leading-tight">
                                <span className="text-foreground font-bold">5+</span> teams streamlining <br /> their workflow with Manage.
                            </div>
                        </div>
                    </div>

                    {/* App Mockup */}
                    <div className="flex-1 w-full max-w-2xl perspective-1000 animate-in slide-in-from-right-10 fade-in duration-1000 delay-300">
                        <div className="bg-gradient-to-br from-card/90 to-background/50 backdrop-blur-3xl border border-white/10 p-4 md:p-8 rounded-[2rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] transform rotate-y-minus-12 hover:rotate-y-0 transition-transform duration-1000 ease-out group">
                            <div className="flex items-center justify-between mb-8 border-b border-border/50 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                </div>
                                <div className="px-4 py-1.5 rounded-full bg-secondary/50 text-xs font-mono text-muted-foreground border border-border/50">
                                    app.manage.space
                                </div>
                                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500/20" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Backlog</div>
                                    <div className="p-4 bg-card rounded-xl border border-border/50 shadow-sm animate-pulse">
                                        <div className="h-2 w-full bg-muted/40 rounded-full mb-2"></div>
                                        <div className="h-2 w-2/3 bg-muted/20 rounded-full"></div>
                                    </div>
                                    <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 shadow-sm border-dashed">
                                        <div className="h-2 w-1/2 bg-primary/20 rounded-full mb-2"></div>
                                        <div className="h-2 w-1/3 bg-primary/10 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">In Progress</div>
                                    <div className="p-4 bg-card rounded-xl border border-primary shadow-lg ring-1 ring-primary/20 transform translate-x-1 translate-y-1">
                                        <div className="h-2 w-full bg-primary/20 rounded-full mb-3"></div>
                                        <div className="flex justify-between items-center">
                                            <div className="h-2 w-1/4 bg-muted/40 rounded-full"></div>
                                            <div className="w-6 h-6 rounded-full bg-primary/10"></div>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-card rounded-xl border border-border/50 shadow-sm opacity-60">
                                        <div className="h-2 w-full bg-muted/20 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Features Section */}
            <section className="py-32 px-6 bg-secondary/30 relative">
                <div className="container max-w-7xl mx-auto space-y-16">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl md:text-5xl font-extrabold font-heading text-foreground">Everything you need, nothing you don't.</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            We've stripped away the bloat to focus on the essential features for efficient project management.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: <Zap className="w-6 h-6" />, title: "Hyper Fast", desc: "No loading screens. Just instant, snappy interactions that keep you in flow." },
                            { icon: <CheckCircle2 className="w-6 h-6" />, title: "Clear Views", desc: "Elegantly organized boards that show exactly what's happening at a glance." },
                            { icon: <Users className="w-6 h-6" />, title: "Collaboration", desc: "Built for teams of all sizes with seamless workspace sharing." },
                            { icon: <Shield className="w-6 h-6" />, title: "Privacy First", desc: "Your data is yours. Secure authentication and encrypted storage by default." }
                        ].map((feature, i) => (
                            <div key={i} className="p-8 rounded-3xl border border-border bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 font-heading">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-6 text-center">
                <div className="container max-w-4xl mx-auto space-y-10 p-12 md:p-20 rounded-[3rem] bg-foreground text-background relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 -m-12 opacity-10">
                        <InfinityIcon className="w-64 h-64 text-background" />
                    </div>
                    <div className="relative z-10 space-y-6">
                        <h2 className="text-4xl md:text-6xl font-extrabold font-heading">Ready to find your flow?</h2>
                        <p className="text-xl text-background/70 max-w-xl mx-auto">
                            Join thousands of teams who have found a calmer, more productive way to work.
                        </p>
                        <div className="relative w-fit mx-auto pt-4 group">
                            <div className="flex items-center gap-3 px-10 py-5 rounded-full bg-primary text-primary-foreground font-bold text-xl shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group-hover:bg-primary/90">
                                Start Your Journey
                            </div>
                            <div id="google-login-btn-overlay-bottom" className="absolute inset-0 opacity-0 cursor-pointer overflow-hidden z-20"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-6 border-t border-border/50">
                <div className="container max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                        <div className="space-y-6 max-w-sm">
                            <div className="flex items-center gap-2">
                                <span className="font-heading font-bold text-3xl tracking-wide text-primary">Manage</span>
                            </div>
                            <p className="text-muted-foreground">
                                Building the future of project management with a focus on simplicity, speed, and serenity.
                            </p>
                            <div className="flex items-center gap-4">
                                <a href="#" className="p-2 rounded-full border border-border hover:text-primary hover:border-primary transition-all">
                                    <Twitter className="w-5 h-5" />
                                </a>
                                <a href="#" className="p-2 rounded-full border border-border hover:text-primary hover:border-primary transition-all">
                                    <Github className="w-5 h-5" />
                                </a>
                                <a href="#" className="p-2 rounded-full border border-border hover:text-primary hover:border-primary transition-all">
                                    <Terminal className="w-5 h-5" />
                                </a>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 sm:gap-24">
                            <div className="space-y-4">
                                <h4 className="font-bold uppercase tracking-widest text-xs text-muted-foreground">Product</h4>
                                <ul className="space-y-3 text-sm font-medium">
                                    <li><button onClick={() => setCurrentView("home")} className="hover:text-primary transition-colors">Platform</button></li>
                                    <li><button onClick={() => setCurrentView("changelog")} className="hover:text-primary transition-colors">Changelog</button></li>
                                    <li><button onClick={() => setCurrentView("about")} className="hover:text-primary transition-colors">About</button></li>
                                </ul>
                            </div>
                            <div className="space-y-4">
                                <h4 className="font-bold uppercase tracking-widest text-xs text-muted-foreground">Philosophy</h4>
                                <ul className="space-y-3 text-sm font-medium">
                                    <li><a href="#" className="hover:text-primary transition-colors">Flow State</a></li>
                                    <li><a href="#" className="hover:text-primary transition-colors">Simple Rules</a></li>
                                    <li><a href="#" className="hover:text-primary transition-colors">Design Ethics</a></li>
                                </ul>
                            </div>
                            <div className="space-y-4 hidden sm:block">
                                <h4 className="font-bold uppercase tracking-widest text-xs text-muted-foreground">Community</h4>
                                <ul className="space-y-3 text-sm font-medium">
                                    <li><a href="#" className="hover:text-primary transition-colors">Discord</a></li>
                                    <li><a href="#" className="hover:text-primary transition-colors">Twitter</a></li>
                                    <li><a href="#" className="hover:text-primary transition-colors">Showcase</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="mt-20 pt-8 border-t border-border/30 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground font-medium">
                        <div>© 2025 Manage Space. All rights reserved.</div>
                        <div className="flex gap-8">
                            <a href="#" className="hover:text-foreground">Privacy Policy</a>
                            <a href="#" className="hover:text-foreground">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );

    const renderContent = () => {
        if (currentView === "about") return <About />;
        if (currentView === "changelog") return <Changelog />;
        return renderLandingContent();
    };

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-primary/20">
            {/* Navbar */}
            <header className="px-6 py-4 flex justify-between items-center border-b border-border/40 bg-background/50 backdrop-blur-md sticky top-0 z-50 transition-all">
                <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setCurrentView("home")}>
                    <span className="font-heading font-bold text-3xl tracking-tight text-primary transition-all group-hover:tracking-normal">Manage</span>
                </div>
                <nav className="flex items-center gap-6 md:gap-10 text-sm font-bold text-muted-foreground">
                    <button onClick={() => setCurrentView("changelog")} className={`hover:text-primary transition-colors relative ${currentView === 'changelog' ? 'text-primary' : ''}`}>
                        Changelog
                        {currentView === 'changelog' && <span className="absolute -bottom-6 left-0 right-0 h-1 bg-primary rounded-full" />}
                    </button>
                    <button onClick={() => setCurrentView("about")} className={`hover:text-primary transition-colors relative ${currentView === 'about' ? 'text-primary' : ''}`}>
                        About
                        {currentView === 'about' && <span className="absolute -bottom-6 left-0 right-0 h-1 bg-primary rounded-full" />}
                    </button>
                    <ThemeToggle />
                </nav>
            </header>

            {renderContent()}
        </div>
    );
}
