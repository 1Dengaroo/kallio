'use client';

import {
  SignUpButton,
  SignInButton,
  SignedIn,
  useUser,
  SignedOut,
  UserButton
} from '@clerk/nextjs';
import { SidebarMenuButton } from '../ui/sidebar';
import { LogIn, UserPlus } from 'lucide-react';
import { dark } from '@clerk/themes';

export function UserMenu() {
  const user = useUser();

  return (
    <>
      <SignedOut>
        <SignInButton>
          <SidebarMenuButton className="cursor-pointer">
            <div className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </div>
          </SidebarMenuButton>
        </SignInButton>
        <SignUpButton>
          <SidebarMenuButton className="cursor-pointer">
            <div className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              <span>Register</span>
            </div>
          </SidebarMenuButton>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <div className="flex items-center gap-3 px-2 py-2">
          <UserButton
            appearance={{
              baseTheme: dark
            }}
          />
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium truncate">
              {user.user?.fullName || user.user?.firstName || 'User'}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {user.user?.primaryEmailAddress?.emailAddress}
            </span>
          </div>
        </div>
      </SignedIn>
    </>
  );
}
