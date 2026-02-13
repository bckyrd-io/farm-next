"use client";
import useUserStore from '../app/store/zustand'; // Import your Zustand store
import { Calendar, Home, Settings, Users, Edit, FolderCheck, PieChart, TableIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation'; // Import necessary hooks
import {
    Sidebar,
    SidebarContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
    SidebarHeader,
} from '@/components/ui/sidebar';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

const items = [
    {
        title: 'Home',
        url: 'farm/dashboard',
        icon: Home,
        roles: ['admin'],
    },
    {
        title: 'Branch',
        url: 'farm/branch',
        icon: Settings,
        roles: ['admin'],
    },
    {
        title: 'Activity',
        url: 'farm/activity',
        icon: Edit,
        roles: ['Staff', 'admin'],
    },
    {
        title: 'Schedule',
        url: 'farm/schedule',
        icon: Calendar,
        roles: ['Staff', 'admin'],
    },
    {
        title: 'Resource',
        url: 'farm/resource',
        icon: FolderCheck,
        roles: ['Staff', 'admin'],
    },
    {
        title: 'Performance',
        url: 'farm/staff',
        icon: PieChart,
        roles: ['admin'],
    },
    {
        title: 'Users',
        url: 'farm/user',
        icon: Users,
        roles: ['admin'],
    },
    {
        title: 'Reports',
        url: 'farm/report',
        icon: TableIcon,
        roles: ['admin'],
    },
];

export function AppSidebar() {
    const { user, clearUser } = useUserStore(); // Access Zustand store
    const pathname = usePathname(); // Get the current path
    const router = useRouter(); // Initialize the router instance
    const avatarUrl = `https://github.com/shadcn.png`;

    // If user is not logged in, do not render the sidebar
    if (!user) {
        return null;
    }

    const handleLogout = () => {
        clearUser(); // Clear user data from Zustand store
        router.push('/'); // Redirect to the index page
    };

    const isActive = (itemUrl: string) => pathname.startsWith(`/${itemUrl}`); // Check if the current path starts with the item's URL

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu className="pb-4 border-b border-gray-200">
                    <SidebarMenuItem>
                        <div className="flex items-center gap-x-2 ">
                            <div className="flex items-center justify-center ">
                                <Image
                                    src="/logo.png" // Your logo path
                                    alt="Logo"
                                    width={20}
                                    height={20}
                                    className="size-8"
                                />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">Ground</span>
                                <span className="truncate text-xs text-muted-foreground">
                                    Farm Dashboard
                                </span>
                            </div>
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {items
                        .filter((item) => item.roles.includes(user.role)) // Filter items based on the user's role
                        .map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                    <Link href={`/${item.url}`} className={isActive(item.url) ? 'text-primary ' : ''}>
                                        <item.icon className={isActive(item.url) ? 'text-primary' : 'text-gray-500'} />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
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
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}