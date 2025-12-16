import { useEffect } from "react";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
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
                            alert("Login failed. Check console for details.");
                        }
                    },
                });

                // Render invisible button over our custom button
                google.accounts.id.renderButton(
                    document.getElementById("google-login-btn-overlay"),
                    { theme: "outline", size: "large", type: "standard", shape: "pill", width: 300 }
                );
            } catch (err) {
                console.error("Google auth init error", err);
            }
        }
    }, [onLogin]);

    const renderContent = () => {
        if (currentView === "about") return <About />;
        if (currentView === "changelog") return <Changelog />;

        return (
            <main className="flex-1 flex flex-col md:flex-row items-center justify-center p-6 md:p-24 gap-12 relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-parent to-parent">
                {/* Decorative Background Blobs */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px] opacity-40 -z-10 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-accent/30 rounded-full blur-[100px] opacity-40 -z-10 animate-pulse delay-700"></div>

                {/* Left: Hero Text */}
                <div className="flex-1 space-y-8 max-w-xl z-10 animate-in slide-in-from-bottom-10 fade-in duration-700">
                    <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary shadow-sm backdrop-blur-sm">
                        <span className="block h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                        v1.0 is here
                    </div>
                    <h1 className="font-heading text-5xl md:text-7xl font-extrabold tracking-tight text-foreground pb-2 leading-tight drop-shadow-sm">
                        Manage work. <br /> <span className="text-primary italic">Naturally.</span>
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                        The simplest way to keep your team in sync. Drag, drop, and flow with our elegant olive-themed workspace.
                    </p>

                    {/* Custom Google Button Container */}
                    <div className="relative pt-4 w-fit">
                        {/* Our Custom Button Visual */}
                        <div className="flex items-center gap-3 px-6 py-3 rounded-full border-2 border-primary text-primary font-medium transition-all duration-300 hover:bg-primary hover:text-primary-foreground group cursor-pointer shadow-lg shadow-primary/10">
                            <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" className="group-hover:fill-white" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" className="group-hover:fill-white" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" className="group-hover:fill-white" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" className="group-hover:fill-white" />
                            </svg>
                            <span className="text-lg">Sign in with Google</span>
                        </div>

                        {/* Invisible Google Button Overlay */}
                        <div id="google-login-btn-overlay" className="absolute inset-0 opacity-0 cursor-pointer overflow-hidden z-20 transform scale-150 origin-top-left pointer-events-auto"></div>
                    </div>

                    <div className="pt-8 flex items-center gap-4 text-sm text-muted-foreground/80">
                        <div className="flex -space-x-3">
                            {[1].map((i) => (
                                <div key={i} className={`w-9 h-9 rounded-full border-2 border-background bg-zinc-200 flex items-center justify-center overflow-hidden shadow-sm z-${10 - i}`}>
                                    {/* Placeholder Avatar */}
                                    <div className={`w-full h-full bg-gradient-to-br from-primary/40 to-primary/60`} />
                                </div>
                            ))}
                        </div>
                        <span className="font-medium">Trusted by <span className="text-foreground font-semibold">Ritam</span></span>
                    </div>
                </div>

                {/* Right: Mockup Card */}
                <div className="flex-1 w-full max-w-md relative z-10 perspective-1000 animate-in slide-in-from-right-10 fade-in duration-1000 delay-200">
                    <div className="bg-gradient-to-br from-card/80 to-background/40 backdrop-blur-2xl border border-white/10 p-6 rounded-3xl shadow-2xl transform rotate-y-minus-6 hover:rotate-0 transition-transform duration-700 ring-1 ring-white/5 group">
                        <div className="flex items-center justify-between mb-8">
                            <div className="h-2.5 w-24 bg-muted/40 rounded-full"></div>
                            <div className="h-10 w-10 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center">
                                <div className="h-4 w-4 bg-primary rounded-full shadow-lg shadow-primary/50"></div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="p-4 bg-card/60 backdrop-blur-sm rounded-xl shadow-sm border border-white/5 hover:border-primary/20 transition-colors group-hover:translate-x-1 duration-500" style={{ transitionDelay: `${i * 100}ms` }}>
                                    <div className="h-2.5 w-3/4 bg-muted/50 rounded-full mb-3"></div>
                                    <div className="h-2 w-1/2 bg-muted/40 rounded-full"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </main>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-primary/20">
            {/* Navbar */}
            <header className="px-6 py-4 flex justify-between items-center border-b border-border/40 bg-background/50 backdrop-blur-md sticky top-0 z-50 transition-all">
                <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setCurrentView("home")}>
                    <span className="font-heading font-bold text-4xl tracking-wide text-primary transition-all group-hover:tracking-wider">Manage</span>
                </div>
                <nav className="flex items-center gap-8 text-sm font-medium text-muted-foreground">
                    <button onClick={() => setCurrentView("changelog")} className={`hover:text-primary transition-colors ${currentView === 'changelog' ? 'text-primary' : ''}`}>Changelog</button>
                    <button onClick={() => setCurrentView("about")} className={`hover:text-primary transition-colors ${currentView === 'about' ? 'text-primary' : ''}`}>About</button>
                    <ThemeToggle />
                </nav>
            </header>

            {renderContent()}
        </div>
    );
}
