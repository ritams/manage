export default function About() {
    return (
        <div className="min-h-screen pt-24 pb-12 px-6 max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
            <h1 className="font-heading text-4xl font-bold text-foreground">About Manage</h1>
            <div className="prose dark:prose-invert prose-lg text-muted-foreground">
                <p>
                    Manage is designed to be the simplest, most elegant project management tool for individuals and small teams.
                    We believe that tools should be calm, quiet, and beautiful.
                </p>
                <p>
                    Built with a focus on <strong>natural flow</strong>, Manage gets out of your way and lets you focus on what matters: your work.
                </p>
                <h3 className="text-foreground font-heading">Our Philosophy</h3>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Simplicity over features.</li>
                    <li>Speed over complexity.</li>
                    <li>Calmness over notification spam.</li>
                </ul>
            </div>
        </div>
    );
}
