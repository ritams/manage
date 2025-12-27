import { Sparkles, Zap, ShieldCheck, Heart, Layout, MousePointer2, ArrowRight, Users, Target, Globe } from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
};

export default function About() {
    const philosophyCards = [
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Speed over complexity",
            desc: "We prioritize lightning-fast interactions and intuitive flows so you can spend less time managing and more time doing."
        },
        {
            icon: <Layout className="w-6 h-6" />,
            title: "Simplicity by design",
            desc: "Every feature is carefully considered. If it doesn't add value to your daily workflow, it doesn't make the cut."
        },
        {
            icon: <ShieldCheck className="w-6 h-6" />,
            title: "Calm and Quiet",
            desc: "No notification spam or dark patterns. Cardio respects your focus and provides a serene environment for your thoughts."
        }
    ];

    const values = [
        { icon: <Users className="w-5 h-5" />, label: "Team Focused" },
        { icon: <Target className="w-5 h-5" />, label: "Goal Driven" },
        { icon: <Globe className="w-5 h-5" />, label: "Global First" },
        { icon: <Heart className="w-5 h-5" />, label: "Made with Love" }
    ];

    return (
        <div className="min-h-screen pt-16 sm:pt-24 pb-20 px-4 sm:px-6 max-w-5xl mx-auto space-y-16 sm:space-y-24 overflow-hidden">
            {/* Hero Section */}
            <motion.section
                className="text-center space-y-6 py-6 sm:py-10 relative"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
            >
                {/* Background decoration */}
                <motion.div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-primary/10 to-transparent rounded-full blur-[100px] -z-10"
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 0.3, 0.5]
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                />

                <motion.div
                    variants={fadeInUp}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20 mb-4 backdrop-blur-sm"
                >
                    <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    >
                        <Sparkles className="w-4 h-4" />
                    </motion.div>
                    <span>Meet Cardio</span>
                </motion.div>

                <motion.h1
                    variants={fadeInUp}
                    className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground tracking-tight"
                >
                    Calm tools for{" "}
                    <span className="relative inline-block">
                        <span className="text-primary italic">focused</span>
                        <motion.svg
                            className="absolute -bottom-1 left-0 w-full h-3 text-primary/30"
                            viewBox="0 0 100 12"
                            preserveAspectRatio="none"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1, delay: 0.5 }}
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
                    {" "}teams.
                </motion.h1>

                <motion.p
                    variants={fadeInUp}
                    className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground leading-relaxed"
                >
                    Cardio is designed to be the simplest, most elegant project management tool.
                    We believe your tools should empower you, not distract you.
                </motion.p>

                {/* Values pills */}
                <motion.div
                    variants={fadeInUp}
                    className="flex flex-wrap justify-center gap-3 pt-4"
                >
                    {values.map((value, i) => (
                        <motion.div
                            key={i}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm font-medium shadow-sm"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span className="text-primary">{value.icon}</span>
                            <span>{value.label}</span>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.section>

            {/* Philosophy Grid */}
            <motion.section
                className="grid md:grid-cols-3 gap-6 sm:gap-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
            >
                {philosophyCards.map((card, i) => (
                    <motion.div
                        key={i}
                        variants={scaleIn}
                        className="group p-6 sm:p-8 rounded-3xl border border-border bg-card/50 backdrop-blur-xl hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 relative overflow-hidden"
                        whileHover={{ y: -8 }}
                    >
                        {/* Gradient overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative">
                            <motion.div
                                className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary/20 transition-colors"
                                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                                transition={{ duration: 0.5 }}
                            >
                                {card.icon}
                            </motion.div>
                            <h3 className="text-xl font-bold mb-3 font-heading group-hover:text-primary transition-colors">{card.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{card.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </motion.section>

            {/* Mission Statement */}
            <motion.section
                className="py-12 sm:py-16 text-center relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -z-10" />
                <blockquote className="max-w-3xl mx-auto">
                    <p className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-foreground leading-relaxed">
                        "We don't build features. We craft{" "}
                        <span className="text-primary">experiences</span>{" "}
                        that feel like an extension of your thinking."
                    </p>
                    <footer className="mt-6 text-muted-foreground font-medium">
                        — The Cardio Team
                    </footer>
                </blockquote>
            </motion.section>

            {/* Natural Flow Section */}
            <motion.section
                className="bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-8 md:p-12 border border-primary/10 relative overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                {/* Floating sparkles */}
                <motion.div
                    className="absolute top-8 right-8 opacity-20"
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 180, 360]
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                >
                    <Sparkles className="w-24 h-24 sm:w-32 sm:h-32 text-primary" />
                </motion.div>

                <motion.div
                    className="absolute bottom-4 left-4 opacity-10"
                    animate={{
                        y: [0, 15, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                >
                    <Sparkles className="w-16 h-16 text-primary" />
                </motion.div>

                <div className="max-w-2xl relative z-10 space-y-6">
                    <motion.h2
                        className="text-2xl sm:text-3xl font-bold font-heading"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        Our natural flow approach
                    </motion.h2>
                    <motion.p
                        className="text-base sm:text-lg text-muted-foreground leading-relaxed"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        Traditional tools often feel like chores. Cardio is built with a focus on <strong className="text-foreground">natural flow</strong>,
                        adapting to how you think and move. It's not just a tracker; it's a workspace that grows with you.
                    </motion.p>

                    <motion.div
                        className="flex flex-wrap gap-3 sm:gap-4 pt-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                    >
                        {[
                            { icon: <MousePointer2 className="w-4 h-4" />, label: "Natural Interactions" },
                            { icon: <Heart className="w-4 h-4" />, label: "Built with Love" },
                            { icon: <Zap className="w-4 h-4" />, label: "Lightning Speed" }
                        ].map((item, i) => (
                            <motion.span
                                key={i}
                                className="flex items-center gap-2 text-sm font-medium text-foreground bg-background px-4 py-2.5 rounded-full border border-border shadow-lg"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <span className="text-primary">{item.icon}</span>
                                {item.label}
                            </motion.span>
                        ))}
                    </motion.div>
                </div>
            </motion.section>

            {/* Timeline/Journey Section */}
            <motion.section
                className="space-y-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
            >
                <motion.div variants={fadeInUp} className="text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold font-heading mb-2">Our Journey</h2>
                    <p className="text-muted-foreground">From idea to reality</p>
                </motion.div>

                <div className="grid sm:grid-cols-3 gap-6">
                    {[
                        { year: "2024", title: "The Spark", desc: "Born from frustration with bloated tools" },
                        { year: "2025", title: "The Build", desc: "Crafted with obsessive attention to detail" },
                        { year: "Now", title: "The Future", desc: "Growing with our amazing community" }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            variants={scaleIn}
                            className="text-center p-6 rounded-2xl bg-card/30 border border-border/50 backdrop-blur-sm hover:border-primary/30 transition-all"
                            whileHover={{ y: -5 }}
                        >
                            <div className="text-3xl sm:text-4xl font-extrabold font-heading text-primary mb-2">{item.year}</div>
                            <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* CTA Section */}
            <motion.section
                className="text-center py-8 sm:py-12"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                <motion.div
                    className="inline-flex items-center gap-2 text-lg font-semibold text-primary cursor-pointer group"
                    whileHover={{ x: 10 }}
                >
                    <span>Ready to experience the difference?</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.div>
            </motion.section>
        </div>
    );
}
