import { Badge } from "@/components/ui/badge";
import { Rocket, Package, Sparkles, Star, GitBranch, Terminal, Layout, Zap, CheckCircle2, Bell, Tag, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
};

const fadeInLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 }
};

const fadeInRight = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 }
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

export default function Changelog() {
    const releases = [
        {
            version: "v1.0.0",
            date: "December 16, 2025",
            title: "Initial Release",
            isLatest: true,
            icon: <Star className="w-5 h-5 fill-current" />,
            features: [
                { icon: <Layout className="w-4 h-4" />, text: "Launched Cardio with Board, List, and Card functionality." },
                { icon: <Zap className="w-4 h-4" />, text: "Implemented smooth drag and drop using dnd-kit." },
                { icon: <CheckCircle2 className="w-4 h-4" />, text: "Integrated secure Google Authentication." },
                { icon: <Sparkles className="w-4 h-4" />, text: "Introduced the refined \"Olive\" theme architecture." },
                { icon: <Tag className="w-4 h-4" />, text: "Added colorful tag system with drag-to-apply." },
                { icon: <Calendar className="w-4 h-4" />, text: "Smart due dates with visual status indicators." },
                { icon: <Bell className="w-4 h-4" />, text: "Real-time notifications for shared boards." }
            ]
        }
    ];

    const techStack = [
        { icon: <Package className="w-3.5 h-3.5" />, name: "React 19" },
        { icon: <GitBranch className="w-3.5 h-3.5" />, name: "Vite" },
        { icon: <Layout className="w-3.5 h-3.5" />, name: "Tailwind CSS" },
        { icon: <Sparkles className="w-3.5 h-3.5" />, name: "Framer Motion" }
    ];

    return (
        <div className="min-h-screen pt-16 sm:pt-24 pb-20 px-4 sm:px-6 max-w-4xl mx-auto space-y-12 sm:space-y-16 overflow-hidden">
            {/* Header */}
            <motion.header
                className="space-y-4 text-center"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
            >
                <motion.div
                    variants={fadeInUp}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold border border-border mb-2"
                >
                    <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <Rocket className="w-4 h-4" />
                    </motion.div>
                    <span>Evolution</span>
                </motion.div>

                <motion.h1
                    variants={fadeInUp}
                    className="font-heading text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight"
                >
                    Changelog
                </motion.h1>

                <motion.p
                    variants={fadeInUp}
                    className="text-lg sm:text-xl text-muted-foreground"
                >
                    The journey of building the ultimate workspace.
                </motion.p>
            </motion.header>

            {/* Timeline */}
            <div className="relative">
                {/* Animated Timeline Line */}
                <motion.div
                    className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary via-primary/50 to-transparent md:-translate-x-1/2"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{ originY: 0 }}
                />

                <div className="space-y-12 sm:space-y-16 relative">
                    {releases.map((release, releaseIndex) => (
                        <motion.div
                            key={release.version}
                            className="relative grid md:grid-cols-2 gap-6 sm:gap-8 items-start"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            variants={staggerContainer}
                        >
                            {/* Left side - Version info */}
                            <motion.div
                                variants={fadeInLeft}
                                className="flex flex-col md:items-end md:text-right space-y-3 pl-12 md:pl-0 pt-2"
                            >
                                <div className="flex items-center md:flex-row-reverse gap-3">
                                    {/* Timeline node */}
                                    <motion.div
                                        className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/30 z-10"
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.3, type: "spring", bounce: 0.5 }}
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        {release.icon}
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <Badge
                                            variant="default"
                                            className={`w-fit shadow-lg ${release.isLatest ? 'bg-primary hover:bg-primary shadow-primary/20' : 'bg-secondary hover:bg-secondary'}`}
                                        >
                                            {release.version}
                                            {release.isLatest && (
                                                <motion.span
                                                    className="ml-1.5 text-[10px] opacity-70"
                                                    animate={{ opacity: [0.7, 1, 0.7] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                >
                                                    LATEST
                                                </motion.span>
                                            )}
                                        </Badge>
                                    </motion.div>
                                </div>
                                <span className="text-sm font-semibold text-muted-foreground">{release.date}</span>
                            </motion.div>

                            {/* Right side - Content card */}
                            <motion.div
                                variants={fadeInRight}
                                className="ml-12 md:ml-0 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-border bg-card/50 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:border-primary/30 transition-all duration-500 group"
                                whileHover={{ y: -5 }}
                            >
                                {/* Gradient overlay on hover */}
                                <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative">
                                    <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4 sm:mb-5 font-heading flex items-center gap-2 group-hover:text-primary transition-colors">
                                        <motion.div
                                            animate={{ rotate: [0, 360] }}
                                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                        >
                                            <Sparkles className="w-5 h-5 text-primary" />
                                        </motion.div>
                                        {release.title}
                                    </h2>

                                    <motion.ul
                                        className="space-y-3"
                                        variants={staggerContainer}
                                    >
                                        {release.features.map((feature, i) => (
                                            <motion.li
                                                key={i}
                                                className="flex gap-3 text-muted-foreground group/item"
                                                variants={fadeInUp}
                                                whileHover={{ x: 5 }}
                                            >
                                                <div className="mt-0.5 w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover/item:bg-primary/20 transition-colors">
                                                    {feature.icon}
                                                </div>
                                                <span className="group-hover/item:text-foreground transition-colors">{feature.text}</span>
                                            </motion.li>
                                        ))}
                                    </motion.ul>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}

                    {/* Future placeholder */}
                    <motion.div
                        className="flex justify-center pt-4 sm:pt-8"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="flex flex-col items-center gap-3 text-center">
                            <motion.div
                                className="w-px h-12 bg-gradient-to-b from-border to-transparent"
                                animate={{ scaleY: [1, 0.8, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <motion.div
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-dashed border-border"
                                whileHover={{ scale: 1.05 }}
                            >
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Sparkles className="w-4 h-4 text-primary" />
                                </motion.div>
                                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">More to come</span>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Roadmap Preview */}
            <motion.section
                className="py-8 sm:py-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <div className="text-center mb-6 sm:mb-8">
                    <h3 className="text-xl sm:text-2xl font-bold font-heading mb-2">What's Next</h3>
                    <p className="text-muted-foreground">Features we're working on</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    {[
                        { label: "Keyboard Shortcuts", status: "In Progress" },
                        { label: "Mobile App", status: "Planned" },
                        { label: "API Access", status: "Planned" },
                        { label: "Integrations", status: "Planned" }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-card/50 border border-border/50 text-center hover:border-primary/30 transition-all"
                            whileHover={{ y: -3 }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className="text-sm font-semibold mb-1">{item.label}</div>
                            <div className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block ${item.status === "In Progress"
                                ? "bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground"
                                }`}>
                                {item.status}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Tech Stack Footer */}
            <motion.footer
                className="pt-12 sm:pt-16 border-t border-border/50 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-6 flex items-center justify-center gap-2">
                    <Terminal className="w-4 h-4" />
                    Built with modern tech
                </h3>

                <motion.div
                    className="flex flex-wrap justify-center gap-3"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                >
                    {techStack.map((tech, i) => (
                        <motion.div
                            key={i}
                            variants={fadeInUp}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Badge
                                variant="outline"
                                className="px-4 py-2 text-sm font-medium flex items-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-default"
                            >
                                <span className="text-primary">{tech.icon}</span>
                                {tech.name}
                            </Badge>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.footer>
        </div>
    );
}
