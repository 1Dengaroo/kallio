import {
  AudioWaveform,
  BookOpen,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  Upload,
  Video,
  Image,
  Music,
  Type,
} from "lucide-react";

const sidebarData = {
  teams: [
    {
      name: "Kallio Marketing",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Kallio Development",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Personal",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Documentation",
      url: "/docs",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "/projects/1",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "/projects/2",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "/projects/3",
      icon: Map,
    },
  ],
  kallio: [
    {
      name: "Upload",
      onClick: () => {},
      icon: Upload,
    },
    {
      name: "Video",
      onClick: () => {},
      icon: Video,
    },
    {
      name: "Photos",
      onClick: () => {},
      icon: Image,
    },
    {
      name: "Audio",
      onClick: () => {},
      icon: Music,
    },
    {
      name: "Captions",
      onClick: () => {},
      icon: Type,
    },
  ],
};

export default sidebarData;
