"use client";

import useUserStore from '../app/store/zustand'; // Import your Zustand store
import { Calendar, Home, Settings, Users, Edit, FolderCheck } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const items = [
  {
    title: 'Dashboard',
    url: 'dashboard',
    icon: Home,
  },
  {
    title: 'Branch',
    url: 'branch',
    icon: Settings,
  },
  {
    title: 'User',
    url: 'user',
    icon: Users,
  },
  {
    title: 'Activity',
    url: 'activity',
    icon: Edit,
  },
  {
    title: 'Plan',
    url: 'schedule',
    icon: Calendar,
  },
  {
    title: 'Resource',
    url: 'resource',
    icon: FolderCheck,
  },
];

export function AppSidebar() {
  const { user, clearUser } = useUserStore(); // Access Zustand store
  const router = useRouter();

  const handleLogout = () => {
    clearUser(); // Clear user data from Zustand store
    router.push('/'); // Redirect to the index page
  };

  const avatarUrl = `https://github.com/shadcn.png`;

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          {user ? (

            <>
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={avatarUrl} alt={user.username} />
                  <AvatarFallback>{user.username[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user.username}</span>
              </div>
              <Button onClick={handleLogout} variant="destructive" className="ml-2">
                Logout
              </Button>
            </>
            
          ) : (
           <>...</>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
