'use client';

import * as React from 'react';
import { ChevronsUpDown, Plus, type LucideIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';

type Project = {
  name: string;
  url: string;
  icon: LucideIcon;
};

export function ProjectSwitcher({ projects }: { projects: Project[] }) {
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();

  const activeProject =
    projects.find((project) => pathname === project.url) || projects[0];

  if (!activeProject) {
    return null;
  }

  return (
    <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <activeProject.icon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {activeProject.name}
                  </span>
                  <span className="truncate text-xs">Active Project</span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="start"
              side={isMobile ? 'bottom' : 'right'}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Projects
              </DropdownMenuLabel>
              {projects.map((project) => (
                <DropdownMenuItem
                  key={project.name}
                  onClick={() => router.push(project.url)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    <project.icon className="size-3.5 shrink-0" />
                  </div>
                  {project.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuItem
                    className="gap-2 p-2 opacity-50 cursor-not-allowed"
                    disabled
                    onSelect={(e) => e.preventDefault()}
                  >
                    <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                      <Plus className="size-4" />
                    </div>
                    <div className="text-muted-foreground font-medium">
                      New project
                    </div>
                  </DropdownMenuItem>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Requires database connection (PostgreSQL)</p>
                </TooltipContent>
              </Tooltip>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    );
}
