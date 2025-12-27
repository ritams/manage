import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle() {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("theme") || "dark";
        }
        return "dark";
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}>
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors relative overflow-hidden"
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={theme}
                        initial={{ y: -20, opacity: 0, rotate: -90 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        exit={{ y: 20, opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.2 }}
                    >
                        {theme === "light" ? (
                            <Sun className="h-5 w-5" />
                        ) : (
                            <Moon className="h-5 w-5" />
                        )}
                    </motion.div>
                </AnimatePresence>
                <span className="sr-only">Toggle theme</span>
            </Button>
        </motion.div>
    );
}
