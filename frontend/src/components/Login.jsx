import { useEffect } from "react";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { motion, useScroll, useTransform } from "framer-motion";
import {
    Sparkles,
    CheckCircle2,
    Zap,
    Users,
    Shield,
    Infinity as InfinityIcon,
    Terminal,
    Github,
    Twitter,
    ArrowRight,
    Star,
    Layers,
    Clock,
    Palette
} from "lucide-react";
import About from "./About";
import Changelog from "./Changelog";
import ThemeToggle from "./ThemeToggle";

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
};

const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
};

// Floating orb component
const FloatingOrb = ({ className, delay = 0, duration = 20 }) => (
    <motion.div
        className={className}
        animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            scale: [1, 1.1, 1]
        }}
        transition={{
            duration,
            repeat: Infinity,
            delay,
            ease: "easeInOut"
        }}
    />
);

export default function Login({ onLogin, currentView, setCurrentView }) {
    const { scrollY } = useScroll();
    const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
    const heroScale = useTransform(scrollY, [0, 400], [1, 0.95]);

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

    const features = [
        { icon: <Zap className="w-6 h-6" />, title: "Lightning Fast", desc: "No loading screens. Instant, snappy interactions that keep you in flow state.", color: "from-yellow-500/20 to-orange-500/20" },
        { icon: <Layers className="w-6 h-6" />, title: "Organized Views", desc: "Elegantly organized boards showing exactly what's happening at a glance.", color: "from-blue-500/20 to-cyan-500/20" },
        { icon: <Users className="w-6 h-6" />, title: "Team Sync", desc: "Built for teams of all sizes with seamless workspace sharing and collaboration.", color: "from-violet-500/20 to-purple-500/20" },
        { icon: <Shield className="w-6 h-6" />, title: "Privacy First", desc: "Your data is yours. Secure authentication and encrypted storage by default.", color: "from-emerald-500/20 to-teal-500/20" },
        { icon: <Clock className="w-6 h-6" />, title: "Smart Deadlines", desc: "Intelligent due date tracking with visual indicators and reminders.", color: "from-rose-500/20 to-pink-500/20" },
        { icon: <Palette className="w-6 h-6" />, title: "Beautiful Design", desc: "Crafted with attention to every detail. A joy to use every single day.", color: "from-amber-500/20 to-yellow-500/20" }
    ];

    const renderLandingContent = () => (
        <div className="flex flex-col">
            {/* Hero Section */}
            <motion.main
                style={{ opacity: heroOpacity, scale: heroScale }}
                className="relative min-h-[100vh] flex flex-col items-center justify-center px-4 sm:px-6 pt-20 pb-12 overflow-hidden"
            >
                {/* Animated Background */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <FloatingOrb
                        className="absolute top-10 right-[10%] w-[500px] h-[500px] bg-gradient-to-br from-primary/30 to-primary/5 rounded-full blur-[100px]"
                        delay={0}
                        duration={25}
                    />
                    <FloatingOrb
                        className="absolute bottom-20 left-[5%] w-[400px] h-[400px] bg-gradient-to-tr from-primary/20 to-accent/30 rounded-full blur-[120px]"
                        delay={2}
                        duration={30}
                    />
                    <FloatingOrb
                        className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-gradient-to-r from-primary/10 to-transparent rounded-full blur-[80px]"
                        delay={4}
                        duration={20}
                    />
                    {/* Grid pattern overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(var(--primary)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,oklch(var(--primary)/0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
                </div>

                <div className="container max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20 z-10 pt-8 sm:pt-0">
                    {/* Left Content */}
                    <motion.div
                        className="flex-1 space-y-6 sm:space-y-8 text-center lg:text-left"
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeInUp}>
                            <Badge
                                variant="secondary"
                                className="px-4 py-2 text-sm font-semibold bg-primary/10 text-primary border-primary/20 backdrop-blur-xl shadow-lg shadow-primary/5 hover:shadow-primary/10 transition-shadow cursor-default"
                            >
                                <motion.div
                                    animate={{ rotate: [0, 15, -15, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                >
                                    <Sparkles className="w-4 h-4 mr-2 fill-primary/30" />
                                </motion.div>
                                Cardio v1.0 is now live
                            </Badge>
                        </motion.div>

                        <motion.h1
                            variants={fadeInUp}
                            className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-foreground leading-[1.05]"
                        >
                            Focus on the{" "}
                            <br className="hidden sm:block" />
                            <span className="relative inline-block">
                                <span className="text-primary italic">work</span>
                                <motion.svg
                                    className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-3 text-primary/30"
                                    viewBox="0 0 100 12"
                                    preserveAspectRatio="none"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 1, delay: 0.8 }}
                                >
                                    <motion.path
                                        d="M0,10 Q50,0 100,10"
                                        stroke="currentColor"
                                        strokeWidth="6"
                                        fill="none"
                                        strokeLinecap="round"
                                    />
                                </motion.svg>
                            </span>
                            {" "}that matters.
                        </motion.h1>

                        <motion.p
                            variants={fadeInUp}
                            className="text-lg sm:text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0"
                        >
                            The calm, elegant workspace designed for high-performing teams who value clarity over noise.
                        </motion.p>

                        <motion.div
                            variants={fadeInUp}
                            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-4"
                        >
                            {/* Custom Google Button Container */}
                            <motion.div
                                className="relative group"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-primary/30 rounded-full blur-lg opacity-60 group-hover:opacity-100 transition-opacity" />
                                <div className="relative flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold transition-all shadow-2xl shadow-primary/30">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    <span className="text-base sm:text-lg">Get Started with Google</span>
                                </div>
                                <div id="google-login-btn-overlay" className="absolute inset-0 opacity-0 cursor-pointer overflow-hidden z-20 transform scale-150 origin-top-left"></div>
                            </motion.div>

                            <motion.button
                                onClick={() => setCurrentView("about")}
                                className="group flex items-center gap-2 text-base sm:text-lg font-semibold text-muted-foreground hover:text-foreground transition-colors"
                                whileHover={{ x: 5 }}
                            >
                                Learn about our philosophy
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </motion.button>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <motion.div
                                        key={i}
                                        className="w-10 h-10 rounded-full border-2 border-background bg-card flex items-center justify-center overflow-hidden shadow-lg"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.8 + i * 0.1 }}
                                    >
                                        <div className={`w-full h-full bg-gradient-to-br from-primary/${20 + i * 15} to-primary/${40 + i * 15}`} />
                                    </motion.div>
                                ))}
                            </div>
                            <div className="text-sm text-muted-foreground leading-tight text-center sm:text-left">
                                <span className="text-foreground font-bold">Teams everywhere</span> are streamlining<br className="hidden sm:block" /> their workflow with Cardio.
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right - App Mockup */}
                    <motion.div
                        className="flex-1 w-full max-w-2xl"
                        initial={{ opacity: 0, y: 50, rotateY: -15 }}
                        animate={{ opacity: 1, y: 0, rotateY: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <motion.div
                            className="relative"
                            whileHover={{ rotateY: 5, rotateX: -2 }}
                            transition={{ duration: 0.4 }}
                            style={{ perspective: 1000 }}
                        >
                            {/* Glow effect */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-[3rem] blur-2xl opacity-50" />

                            <div className="relative bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-3xl border border-white/10 dark:border-white/5 p-5 sm:p-8 rounded-[2rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] overflow-hidden">
                                {/* Window controls */}
                                <div className="flex items-center justify-between mb-6 sm:mb-8 border-b border-border/50 pb-4">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <motion.div
                                            className="w-3 h-3 rounded-full bg-red-400"
                                            whileHover={{ scale: 1.2 }}
                                        />
                                        <motion.div
                                            className="w-3 h-3 rounded-full bg-yellow-400"
                                            whileHover={{ scale: 1.2 }}
                                        />
                                        <motion.div
                                            className="w-3 h-3 rounded-full bg-green-400"
                                            whileHover={{ scale: 1.2 }}
                                        />
                                    </div>
                                    <div className="px-3 sm:px-4 py-1.5 rounded-full bg-secondary/50 text-xs font-mono text-muted-foreground border border-border/50">
                                        app.manage.space
                                    </div>
                                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500/20" />
                                </div>

                                {/* Kanban preview */}
                                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                    <div className="space-y-3 sm:space-y-4">
                                        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Backlog</div>
                                        <motion.div
                                            className="p-3 sm:p-4 bg-card rounded-xl border border-border/50 shadow-sm"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.6 }}
                                        >
                                            <div className="h-2 w-full bg-muted/40 rounded-full mb-2"></div>
                                            <div className="h-2 w-2/3 bg-muted/20 rounded-full"></div>
                                        </motion.div>
                                        <motion.div
                                            className="p-3 sm:p-4 bg-primary/5 rounded-xl border border-primary/20 shadow-sm border-dashed"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.7 }}
                                        >
                                            <div className="h-2 w-1/2 bg-primary/20 rounded-full mb-2"></div>
                                            <div className="h-2 w-1/3 bg-primary/10 rounded-full"></div>
                                        </motion.div>
                                    </div>
                                    <div className="space-y-3 sm:space-y-4">
                                        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">In Progress</div>
                                        <motion.div
                                            className="p-3 sm:p-4 bg-card rounded-xl border-2 border-primary shadow-lg ring-2 ring-primary/20"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.8 }}
                                            whileHover={{ y: -2 }}
                                        >
                                            <div className="h-2 w-full bg-primary/20 rounded-full mb-3"></div>
                                            <div className="flex justify-between items-center">
                                                <div className="h-2 w-1/4 bg-muted/40 rounded-full"></div>
                                                <div className="w-6 h-6 rounded-full bg-primary/20"></div>
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            className="p-3 sm:p-4 bg-card rounded-xl border border-border/50 shadow-sm opacity-60"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 0.6, y: 0 }}
                                            transition={{ delay: 0.9 }}
                                        >
                                            <div className="h-2 w-full bg-muted/20 rounded-full"></div>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
                        <motion.div
                            className="w-1.5 h-1.5 bg-primary rounded-full"
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </div>
                </motion.div>
            </motion.main>

            {/* Features Section */}
            <section className="py-24 sm:py-32 px-4 sm:px-6 bg-gradient-to-b from-secondary/20 via-secondary/40 to-secondary/20 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(var(--primary)/0.05),transparent_70%)]" />

                <motion.div
                    className="container max-w-7xl mx-auto space-y-12 sm:space-y-16 relative"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                >
                    <motion.div variants={fadeInUp} className="text-center space-y-4">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-foreground">
                            Everything you need, nothing you don't.
                        </h2>
                        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                            We've stripped away the bloat to focus on the essential features for efficient project management.
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
                        variants={staggerContainer}
                    >
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                variants={scaleIn}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="group p-6 sm:p-8 rounded-3xl border border-border/50 bg-card/50 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:border-primary/30 transition-all duration-500 relative overflow-hidden"
                            >
                                {/* Gradient background on hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                <div className="relative">
                                    <motion.div
                                        className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary/20 transition-colors"
                                        whileHover={{ rotate: [0, -10, 10, 0] }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {feature.icon}
                                    </motion.div>
                                    <h3 className="text-xl font-bold mb-3 font-heading">{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="py-16 sm:py-20 px-4 sm:px-6">
                <motion.div
                    className="container max-w-5xl mx-auto"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
                        {[
                            { value: "99.9%", label: "Uptime" },
                            { value: "<50ms", label: "Response" },
                            { value: "∞", label: "Boards" },
                            { value: "24/7", label: "Support" }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInUp}
                                className="text-center p-4 sm:p-6 rounded-2xl bg-card/30 border border-border/30 backdrop-blur-sm"
                            >
                                <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-primary mb-2">{stat.value}</div>
                                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* CTA Section */}
            <section className="py-24 sm:py-32 px-4 sm:px-6 text-center">
                <motion.div
                    className="container max-w-4xl mx-auto space-y-10 p-8 sm:p-12 md:p-20 rounded-[2rem] sm:rounded-[3rem] bg-foreground text-background relative overflow-hidden shadow-2xl"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Animated background */}
                    <motion.div
                        className="absolute inset-0 opacity-10"
                        animate={{
                            backgroundPosition: ["0% 0%", "100% 100%"]
                        }}
                        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
                        style={{
                            backgroundImage: "radial-gradient(circle at 20% 80%, oklch(var(--primary)) 0%, transparent 50%)"
                        }}
                    />

                    <motion.div
                        className="absolute top-0 right-0 -m-12 opacity-10"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    >
                        <InfinityIcon className="w-48 h-48 sm:w-64 sm:h-64 text-background" />
                    </motion.div>

                    <div className="relative z-10 space-y-6">
                        <motion.h2
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            Ready to find your flow?
                        </motion.h2>
                        <motion.p
                            className="text-lg sm:text-xl text-background/70 max-w-xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                        >
                            Join thousands of teams who have found a calmer, more productive way to work.
                        </motion.p>
                        <motion.div
                            className="relative w-fit mx-auto pt-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="absolute -inset-2 bg-primary/50 rounded-full blur-xl opacity-50" />
                            <div className="relative flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-full bg-primary text-primary-foreground font-bold text-lg sm:text-xl shadow-2xl">
                                Start Your Journey
                            </div>
                            <div id="google-login-btn-overlay-bottom" className="absolute inset-0 opacity-0 cursor-pointer overflow-hidden z-20"></div>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="py-16 sm:py-20 px-4 sm:px-6 border-t border-border/50">
                <motion.div
                    className="container max-w-7xl mx-auto"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                >
                    <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                        <motion.div variants={fadeInUp} className="space-y-6 max-w-sm">
                            <div className="flex items-center gap-2">
                                <span className="font-heading font-bold text-3xl tracking-wide text-primary">Cardio</span>
                            </div>
                            <p className="text-muted-foreground">
                                Building the future of project management with a focus on simplicity, speed, and serenity.
                            </p>
                            <div className="flex items-center gap-3">
                                {[Twitter, Github, Terminal].map((Icon, i) => (
                                    <motion.a
                                        key={i}
                                        href="#"
                                        className="p-2.5 rounded-full border border-border bg-card/50 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all"
                                        whileHover={{ y: -3, scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12 md:gap-16 lg:gap-24">
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
                        </motion.div>
                    </div>
                    <motion.div
                        variants={fadeIn}
                        className="mt-16 sm:mt-20 pt-8 border-t border-border/30 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground font-medium"
                    >
                        <div>© 2025 Cardio. All rights reserved.</div>
                        <div className="flex gap-6 sm:gap-8">
                            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
                        </div>
                    </motion.div>
                </motion.div>
            </footer>
        </div>
    );

    const renderContent = () => {
        if (currentView === "about") return <About />;
        if (currentView === "changelog") return <Changelog />;
        return renderLandingContent();
    };

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-primary/20 overflow-x-hidden">
            {/* Navbar */}
            <motion.header
                className="px-4 sm:px-6 py-4 flex justify-between items-center border-b border-border/40 bg-background/80 backdrop-blur-xl sticky top-0 z-50"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    className="flex items-center gap-2 group cursor-pointer"
                    onClick={() => setCurrentView("home")}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <span className="font-heading font-bold text-2xl sm:text-3xl tracking-tight text-primary transition-all group-hover:tracking-normal">Cardio</span>
                </motion.div>
                <nav className="flex items-center gap-4 sm:gap-6 md:gap-10 text-sm font-bold text-muted-foreground">
                    {["changelog", "about"].map((view) => (
                        <button
                            key={view}
                            onClick={() => setCurrentView(view)}
                            className={`relative hover:text-primary transition-colors capitalize ${currentView === view ? 'text-primary' : ''}`}
                        >
                            {view}
                            {currentView === view && (
                                <motion.span
                                    className="absolute -bottom-5 left-0 right-0 h-0.5 bg-primary rounded-full"
                                    layoutId="navbar-indicator"
                                />
                            )}
                        </button>
                    ))}
                    <ThemeToggle />
                </nav>
            </motion.header>

            {renderContent()}
        </div>
    );
}
