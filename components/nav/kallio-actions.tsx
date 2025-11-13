'use client';

import { usePathname } from 'next/navigation';
import { type LucideIcon } from 'lucide-react';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';

export function KallioActions({
  kallio
}: {
  kallio: {
    name: string;
    onClick: () => void;
    icon: LucideIcon;
  }[];
}) {
  const pathname = usePathname();
  const isProjectPage = /^\/projects\/[^\/]+$/.test(pathname);

  if (!isProjectPage) {
    return null;
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Kallio</SidebarGroupLabel>
      <SidebarMenu>
        {kallio.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton tooltip={item.name}>
              <item.icon />
              <span>{item.name}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
