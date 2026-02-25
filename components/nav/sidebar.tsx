'use client';

import * as React from 'react';

import { NavUser } from './nav-user';
import { ModeToggle } from '../theme/mode-toggle';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from '@/components/ui/sidebar';
import { Actions } from './actions';
import { ProjectSwitcher } from './project-switcher';
import data from '@/lib/sidebar-items';
import { Github } from 'lucide-react';

function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <ProjectSwitcher projects={data.projects} />
      </SidebarHeader>
      <SidebarContent>
        <Actions />
      </SidebarContent>
      <SidebarFooter>
        <ModeToggle />
        <NavUser />
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-2 text-[10px] text-muted-foreground/50 hover:text-muted-foreground transition-colors group-data-[collapsible=icon]:hidden"
        >
          <Github className="w-3 h-3" />
          <span>View on GitHub</span>
        </a>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export { AppSidebar as Sidebar };
