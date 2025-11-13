import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8">
      <div className="space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-6xl font-extralight">
            4<span className="text-primary">0</span>4
          </h1>
          <p className="text-xl font-light">Page not found</p>
        </div>

        <Button asChild>
          <Link href="/" className="gap-2">
            <ChevronLeft size={16} />
            <span>Return Home</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
