import {
  FileText,
  Home,
  Library,
  Send,
  Triangle,
  FileCheck2,
} from "lucide-react";

export const navItems = [
  {
    id: 11,
    label: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    id: 1,
    label: "AI Library",
    href: "/oracle",
    icon: Library,
  },
  {
    id: 2,
    label: "Contribute",
    href: "/create-oracle",
    icon: Send,
  },
  {
    id: 4,
    label: "My Contract",
    href: "/agent",
    icon: FileText,
  },
  {
    id: 5,
    label: "Subscriptions",
    href: "/subscriptions",
    icon: Triangle,
  },
  // {
  //   id: 6,
  //   label: "Deployed Contracts",
  //   href: "/deployed-contracts",
  //   icon: FileCheck2,
  // },
];
