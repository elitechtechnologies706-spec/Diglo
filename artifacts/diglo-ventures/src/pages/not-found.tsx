import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white px-4 text-[#4A4A4A]">
      <Card className="w-full max-w-md mx-4 border-[#E5E5E5] bg-white shadow-[0_4px_20px_rgba(0,0,0,.06)]">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-black" />
            <h1 className="text-2xl font-bold text-black">
              404 Page Not Found
            </h1>
          </div>

          <p className="mt-4 text-sm text-[#4A4A4A]">
            Did you forget to add the page to the router?
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
