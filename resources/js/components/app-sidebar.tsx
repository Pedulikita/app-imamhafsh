import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { 
    BookOpen, 
    Folder, 
    LayoutGrid, 
    FileText, 
    Newspaper, 
    ImageIcon, 
    Shield, 
    Key,
    Tag,
    FolderKanban,
    Calendar,
    Trophy,
    Users,
    MessageSquare,
    Activity,
    Dumbbell,
    TrendingUp,
    GraduationCap,
    BarChart3,
    Clock,
    ClipboardList,
    PenTool,
    CalendarDays,
    CheckSquare,
    School,
    Heart,
    UserCog,
    Settings,
    Phone,
    Share2,
    type LucideIcon
} from 'lucide-react';
import AppLogo from './app-logo';

interface NavItemWithChildren {
    title: string;
    href?: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
        title: string;
        href: string;
        icon?: LucideIcon;
    }[];
}

// Admin navigation items
const adminNavItems: NavItemWithChildren[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
        icon: BarChart3,
    },
    {
        title: 'Content Management',
        icon: FileText,
        isActive: true,
        items: [
            {
                title: 'Hero Slides',
                href: '/hero-slides',
                icon: ImageIcon,
            },
            {
                title: 'Home Sections',
                href: '/admin/home-sections',
                icon: LayoutGrid,
            },
            {
                title: 'Pages',
                href: '/pages',
                icon: FileText,
            },
            {
                title: 'Articles',
                href: '/admin/articles',
                icon: Newspaper,
            },
           
            {
                title: 'Categories',
                href: '/categories',
                icon: Tag,
            },
        ],
    },
    {
        title: 'Profile Management',
        icon: BookOpen,
        isActive: true,
        items: [
            {
                title: 'Profile Pages',
                href: '/admin/profile-pages',
                icon: FileText,
            },
        ],
    },
    {
        title: 'Daily Activities',
        icon: Activity,
        isActive: true,
        items: [
            {
                title: 'Projects',
                href: '/admin/projects',
                icon: FolderKanban,
            },
            {
                title: 'Activities',
                href: '/admin/activities',
                icon: Calendar,
            },
            {
                title: 'Achievements',
                href: '/admin/achievements',
                icon: Trophy,
            },
            {
                title: 'Ekstrakurikuler',
                href: '/admin/ekstrakurikuler',
                icon: Dumbbell,
            },
             {
                title: 'Literasi Content',
                href: '/admin/literasi-content',
                icon: BookOpen,
            },
        ],
    },
    {
        title: 'Galleries & Team',
        icon: Users,
        isActive: true,
        items: [
            {
                title: 'Events',
                href: '/admin/events',
                icon: Calendar,
            },
            {
                title: 'Testimonies',
                href: '/admin/testimonies',
                icon: MessageSquare,
            },
            {
                title: 'Team Members',
                href: '/admin/team-members',
                icon: Users,
            },
            {
                title: 'Donation Embeds',
                href: '/admin/donation-embeds',
                icon: Heart,
            },
        ],
    },
    {
        title: 'Student Monitoring',
        icon: GraduationCap,
        isActive: true,
        items: [
            {
                title: 'Dashboard',
                href: '/monitoring',
                icon: BarChart3,
            },
            {
                title: 'Students',
                href: '/monitoring/students',
                icon: Users,
            },
            {
                title: 'Student Management',
                href: '/monitoring/student-management',
                icon: Users,
            },
            {
                title: 'Attendance Recording',
                href: '/monitoring/attendance/recording',
                icon: Clock,
            },
            {
                title: 'Progress Reports',
                href: '/monitoring/progress',
                icon: TrendingUp,
            },
        ],
    },
    {
        title: 'User Management',
        icon: Shield,
        isActive: true,
        items: [
            {
                title: 'Users',
                href: '/admin/users',
                icon: UserCog,
            },
            {
                title: 'Roles',
                href: '/roles',
                icon: Shield,
            },
            {
                title: 'Permissions',
                href: '/permissions',
                icon: Key,
            },
        ],
    },
    {
        title: 'Site Settings',
        icon: Settings,
        isActive: true,
        items: [
            {
                title: 'Kontak',
                href: '/admin/settings/contact',
                icon: Phone,
            },
            {
                title: 'Media Sosial',
                href: '/admin/settings/social',
                icon: Share2,
            },
        ],
    },
];

// Teacher navigation items
const teacherNavItems: NavItemWithChildren[] = [
    {
        title: 'Teacher Dashboard',
        href: '/teacher/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'My Classes',
        icon: GraduationCap,
        isActive: true,
        items: [
            {
                title: 'Class List',
                href: '/teacher/classes',
                icon: BookOpen,
            },
            {
                title: 'Create Class',
                href: '/teacher/classes/create',
                icon: Calendar,
            },
        ],
    },
    {
        title: 'Exam & Assessment',
        icon: ClipboardList,
        isActive: true,
        items: [
            {
                title: 'Exam List',
                href: '/teacher/exams',
                icon: FileText,
            },
            {
                title: 'Create Exam',
                href: '/teacher/exams/create',
                icon: PenTool,
            },
            {
                title: 'Question Bank',
                href: '/teacher/exams/questions',
                icon: CheckSquare,
            },
            {
                title: 'Results & Analytics',
                href: '/teacher/exams/results',
                icon: BarChart3,
            },
        ],
    },
    {
        title: 'Schedule Management',
        icon: CalendarDays,
        isActive: true,
        items: [
            {
                title: 'My Schedule',
                href: '/teacher/schedules',
                icon: Calendar,
            },
            {
                title: 'Weekly View',
                href: '/teacher/schedules/weekly',
                icon: CalendarDays,
            },
            {
                title: 'Create Schedule',
                href: '/teacher/schedules/create',
                icon: Clock,
            },
        ],
    },
    {
        title: 'Student Monitoring',
        icon: Users,
        isActive: true,
        items: [
            {
                title: 'Student Management',
                href: '/monitoring/student-management',
                icon: Users,
            },
            {
                title: 'Attendance Recording',
                href: '/teacher/attendance',
                icon: Clock,
            },
            {
                title: 'Grades Management',
                href: '/teacher/grades',
                icon: BarChart3,
            },
            {
                title: 'Progress Reports',
                href: '/monitoring/teacher/reports',
                icon: TrendingUp,
            },
        ],
    },
    {
        title: 'Communication',
        icon: MessageSquare,
        isActive: true,
        items: [
            {
                title: 'Messages',
                href: '/teacher/messages',
                icon: MessageSquare,
            },
            {
                title: 'Announcements',
                href: '/teacher/announcements',
                icon: Newspaper,
            },
            {
                title: 'Parent Communication',
                href: '/teacher/parent-communication',
                icon: Users,
            },
        ],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Settings',
        href: '/settings',
        icon: Folder,
    },
];  

export function AppSidebar() {
    const { props } = usePage();
    const user = props.auth?.user as any;
    
    // Determine which navigation items to show based on user role
    const isTeacher = user?.roles?.some((role: any) => role.name === 'teacher');
    const isSuperAdmin = user?.roles?.some((role: any) => role.name === 'super-admin' || role.name === 'super_admin' || role.name === 'superadmin');
    
    // Super Admin gets full access (admin + teacher menus combined)
    let mainNavItems;
    if (isSuperAdmin) {
        // Create comprehensive super admin navigation with both admin and teacher functions
        mainNavItems = [
            // Admin functions first
            ...adminNavItems,
            // Teacher functions grouped together
            {
                title: 'Teaching & Classes',
                icon: GraduationCap,
                isActive: true,
                items: [
                    {
                        title: 'Teacher Dashboard',
                        href: '/teacher/dashboard',
                        icon: LayoutGrid,
                    },
                    {
                        title: 'Class Management',
                        href: '/teacher/classes',
                        icon: BookOpen,
                    },
                    {
                        title: 'Create Class',
                        href: '/teacher/classes/create',
                        icon: Calendar,
                    },
                    {
                        title: 'My Schedule',
                        href: '/teacher/schedules',
                        icon: CalendarDays,
                    },
                    {
                        title: 'Weekly View',
                        href: '/teacher/schedules/weekly',
                        icon: CalendarDays,
                    },
                ],
            },
            {
                title: 'Exams & Assessments',
                icon: ClipboardList,
                isActive: true,
                items: [
                    {
                        title: 'Exam Management',
                        href: '/teacher/exams',
                        icon: FileText,
                    },
                    {
                        title: 'Create Exam',
                        href: '/teacher/exams/create',
                        icon: PenTool,
                    },
                    {
                        title: 'Question Bank',
                        href: '/teacher/exams/questions',
                        icon: CheckSquare,
                    },
                    {
                        title: 'Results & Analytics',
                        href: '/teacher/exams/results',
                        icon: BarChart3,
                    },
                    {
                        title: 'Grades Management',
                        href: '/teacher/grades',
                        icon: BarChart3,
                    },
                ],
            },
            {
                title: 'Teacher Communication',
                icon: MessageSquare,
                isActive: true,
                items: [
                    {
                        title: 'Messages',
                        href: '/teacher/messages',
                        icon: MessageSquare,
                    },
                    {
                        title: 'Announcements',
                        href: '/teacher/announcements',
                        icon: Newspaper,
                    },
                    {
                        title: 'Parent Communication',
                        href: '/teacher/parent-communication',
                        icon: Users,
                    },
                    {
                        title: 'Teacher Reports',
                        href: '/monitoring/teacher/reports',
                        icon: TrendingUp,
                    },
                ],
            },
        ];
    } else {
        mainNavItems = isTeacher ? teacherNavItems : adminNavItems;
    }
    
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={isSuperAdmin ? dashboard() : (isTeacher ? "/teacher/dashboard" : dashboard())} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
