import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Layers, FileText, Share2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="px-6 h-16 flex items-center justify-between border-b border-border/40 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
            <Layers className="w-5 h-5" />
          </div>
          Synco
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link href="/signup">
            <Button>Get Started</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="py-24 px-6 text-center max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-linear-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
            Your thoughts, <br /> connected.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A minimalistic workspace for your notes and ideas. Create infinite canvases, write in rich text, and organize your mind without the clutter.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="h-12 px-8 text-lg">
                Start Creating <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="https://github.com/your-repo" target="_blank">
              <Button variant="outline" size="lg" className="h-12 px-8 text-lg">
                Open Source
              </Button>
            </Link>
          </div>
        </section>

        <section className="py-24 px-6 bg-muted/30">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold">Rich Text Notes</h3>
              <p className="text-muted-foreground">
                A clean, distraction-free editor powered by Lexical. Markdown support, slash commands, and everything you need to write.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold">Infinite Canvas</h3>
              <p className="text-muted-foreground">
                Visualize your ideas on an infinite canvas. Connect notes, images, and cards to see the big picture.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold">Local First</h3>
              <p className="text-muted-foreground">
                Your data belongs to you. Fast, secure, and designed to work offline (coming soon).
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 px-6 border-t text-center text-muted-foreground text-sm">
        <p>© 2025 Synco. Open source and free forever.</p>
      </footer>
    </div>
  );
}
