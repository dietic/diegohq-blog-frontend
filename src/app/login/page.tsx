import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/8bit/card';
import { vt323 } from '../fonts';
import { Input } from '@/components/ui/8bit/input';
import { Label } from '@/components/ui/8bit/label';
import { Button } from '@/components/ui/8bit/button';

export default function Login() {
  return (
    <div className="h-svh w-full flex items-center justify-center bg-[url('/background-9-16.png')] md:bg-[url('/background-16-9.png')] bg-center bg-cover">
      <Card className="px-4">
        <CardHeader>
          <CardTitle>Welcome back!</CardTitle>
          <CardDescription
            className={`${vt323.className} text-lg flex items-center`}
          >
            Continue your journey ⚔️
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-8">
          <div>
            <Label>Username</Label>
            <Input placeholder="Username" />
          </div>
          <div>
            <Label>Password</Label>
            <Input placeholder="Username" />
          </div>
        </CardContent>
        <CardFooter className="my-4 flex justify-end">
          <Button>Log in</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
