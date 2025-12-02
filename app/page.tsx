import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-6 overflow-hidden bg-gradient-to-b from-background to-muted/20">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Kallio
        </h1>

        <p className="text-foreground font-medium">The AI Video Editor</p>

        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/projects/demo">View Demo</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
