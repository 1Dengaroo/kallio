import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Play, Sparkles, Zap, Layers } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-6 overflow-hidden bg-gradient-to-b from-background via-background to-muted/30">
      {/* Ambient background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative flex flex-col items-center gap-8 text-center max-w-2xl">
        {/* Logo & Badge */}
        <div className="flex flex-col items-center gap-3">
          <div className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
            Portfolio Project
          </div>
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Kallio
          </h1>
        </div>

        {/* Tagline */}
        <div className="space-y-3">
          <p className="text-xl text-muted-foreground">
            A modern video editor built for the web.
          </p>
          <p className="text-sm text-muted-foreground/80">
            Drag, drop, cut, and create. No downloads required.
          </p>
        </div>

        {/* CTA */}
        <div className="flex gap-3">
          <Button asChild size="lg" className="gap-2">
            <Link href="/projects/demo">
              <Play className="w-4 h-4" />
              Try the Demo
            </Link>
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-6 pt-8 mt-4 border-t border-border/50">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="p-2 rounded-lg bg-muted">
              <Layers className="w-5 h-5 text-muted-foreground" />
            </div>
            <span className="text-sm font-medium">Multi-track Timeline</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="p-2 rounded-lg bg-muted">
              <Zap className="w-5 h-5 text-muted-foreground" />
            </div>
            <span className="text-sm font-medium">Real-time Preview</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="p-2 rounded-lg bg-muted">
              <Sparkles className="w-5 h-5 text-muted-foreground" />
            </div>
            <span className="text-sm font-medium">Text Overlays</span>
          </div>
        </div>

        {/* Keyboard hint */}
        <p className="text-xs text-muted-foreground/60 pt-4">
          Pro tip: Press{' '}
          <kbd className="px-1.5 py-0.5 text-[10px] bg-muted rounded border">
            Space
          </kbd>{' '}
          to play/pause
        </p>
      </div>
    </div>
  );
}
