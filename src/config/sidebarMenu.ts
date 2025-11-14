export interface SidebarItem {
  title?: string; // section heading
  label: string; // menu name
  icon?: string; // iconify name
  path?: string; // link
  children?: SidebarItem[]; // sub-menu
  isTitle?: boolean; // section header
}

export const sidebarMenu: SidebarItem[] = [
  // Dashboard
  {
    label: "Dashboard",
    icon: "solar:widget-5-bold-duotone",
    path: "/",
  },

  // User Management
  {
    label: "User Management",
    isTitle: true,
  },
  {
    label: "Users",
    icon: "solar:user-bold-duotone",
    path: "/users",
  },
  {
    label: "Roles",
    icon: "solar:user-id-bold-duotone",
    path: "/roles",
  },
  {
    label: "Module",
    icon: "solar:widget-3-bold-duotone",
    path: "/Modules",
  },
  {
    label: "Permissions",
    icon: "solar:shield-check-bold-duotone",
    path: "/permissions",
  },

 
];
