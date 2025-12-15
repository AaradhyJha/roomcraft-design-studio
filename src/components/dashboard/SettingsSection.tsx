import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { User, Bell, Palette, Shield, HelpCircle } from 'lucide-react';

export function SettingsSection() {
  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold font-heading mb-6">Settings</h2>

      {/* Profile Section */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Profile</h3>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="displayName">Display Name</Label>
            <Input id="displayName" placeholder="Your name" className="mt-1" disabled />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="your@email.com" className="mt-1" disabled />
          </div>
        </div>
      </section>

      <Separator className="my-6" />

      {/* Notifications Section */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Notifications</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email notifications</p>
              <p className="text-sm text-muted-foreground">Receive updates via email</p>
            </div>
            <Switch disabled />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Project updates</p>
              <p className="text-sm text-muted-foreground">Get notified about project changes</p>
            </div>
            <Switch disabled />
          </div>
        </div>
      </section>

      <Separator className="my-6" />

      {/* Appearance Section */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Appearance</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dark mode</p>
              <p className="text-sm text-muted-foreground">Use dark theme</p>
            </div>
            <Switch defaultChecked disabled />
          </div>
        </div>
      </section>

      <Separator className="my-6" />

      {/* Privacy Section */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Privacy</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Public profile</p>
              <p className="text-sm text-muted-foreground">Allow others to see your profile</p>
            </div>
            <Switch disabled />
          </div>
        </div>
      </section>

      <Separator className="my-6" />

      {/* Help Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Help & Support</h3>
        </div>
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start" disabled>
            Documentation
          </Button>
          <Button variant="outline" className="w-full justify-start" disabled>
            Contact Support
          </Button>
        </div>
      </section>

      <div className="mt-8 p-4 rounded-lg bg-secondary/50 text-center">
        <p className="text-sm text-muted-foreground">
          Settings are currently in preview mode. Full functionality coming soon!
        </p>
      </div>
    </div>
  );
}
