"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Bookmark, ChevronLeft, ChevronRight, Menu } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from '@/context/AuthContext'
import { UserProfile } from "@/types/tables"

const NavItems = ({ isCollapsed, pathname, onItemClick }: { 
  isCollapsed: boolean, 
  pathname: string,
  onItemClick?: () => void 
}) => {
  const mainNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/saved', label: 'Saved', icon: <Bookmark size={18} /> },
  ];

  return (
    <ul className="space-y-1">
      {mainNavItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <li key={item.path}>
            <Link
              href={item.path}
              onClick={onItemClick}
              className={`flex items-center p-2 ${isCollapsed ? "justify-center" : "px-4"} text-sm rounded-xl transition-colors ${
                isActive
                  ? 'text-accent bg-sidebar-item-bg'
                  : 'text-secondary hover:bg-sidebar-item-bg'
              }`}
            >
              <span>{item.icon}</span>
              {!isCollapsed && <span className="ml-3">{item.label}</span>}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

const ProfileSection = ({ isCollapsed, profile, isLoggedIn, onProfileClick }: {
  isCollapsed: boolean,
  profile: UserProfile | null,
  isLoggedIn: boolean,
  onProfileClick?: () => void
}) => {
  return (
    <Link href="/profile" className="block" onClick={onProfileClick}>
      <div className="flex items-center group cursor-pointer">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-black font-medium bg-accent">
          {isLoggedIn ? <>{profile?.first_name[0]}{profile?.last_name[0]}</> : ""}
        </div>
        {!isCollapsed && (
          <div className="ml-3">
            {isLoggedIn ?
              <div>
                <p className="text-sm font-medium group-hover:text-white transition-colors">
                  {profile?.first_name} {profile?.last_name}
                </p>
                <p className="text-xs text-gray-400">{profile?.career}</p>
              </div>
              :
              <p className="text-sm font-medium text-primary">Username</p>
            }
          </div>
        )}
      </div>
    </Link>
  );
};

const Logo = ({ isCollapsed }: { isCollapsed: boolean }) => (
  <Link href="/dashboard">
    <h1 className="font-black font-roboto italic cursor-pointer transition-all duration-200 text-2xl">
      <span className="text-brand">S</span>
      {!isCollapsed && <span className="text-brand">uper</span>}
      <br />
      <span className="text-brand">R</span>
      {!isCollapsed && <span className="text-brand">ed</span>}
    </h1>
  </Link>
);

const SidebarContent = ({ 
  isCollapsed, 
  pathname, 
  profile, 
  isLoggedIn, 
  onToggleCollapse,
  onItemClick,
  showCollapseButton = true
}: {
  isCollapsed: boolean,
  pathname: string,
  profile: UserProfile | null,
  isLoggedIn: boolean,
  onToggleCollapse?: () => void,
  onItemClick?: () => void,
  showCollapseButton?: boolean
}) => (
  <>
    <div className="flex items-center justify-between p-4">
      <Logo isCollapsed={isCollapsed} />
      {showCollapseButton && onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          className="ml-2 p-1 rounded hover:bg-sidebar-item-bg transition"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      )}
    </div>
    
    <nav className="flex-1 px-2 py-4">
      <NavItems isCollapsed={isCollapsed} pathname={pathname} onItemClick={onItemClick} />
    </nav>

    <div className={`border-t border-sidebar-border ${isCollapsed ? "px-2 py-3" : "px-4 py-3"}`}>
      <ProfileSection 
        isCollapsed={isCollapsed} 
        profile={profile} 
        isLoggedIn={isLoggedIn} 
        onProfileClick={onItemClick}
      />
    </div>
  </>
);

export default function Sidebar() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const { user } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      if (mobile) {
        setIsCollapsed(true)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (!profile && window.location.pathname !== '/complete-profile') {
        window.location.href = '/complete-profile'
      }
      return profile
    } catch (error) {
      console.error('Exception fetching profile:', error)
      return null
    }
  }

  useEffect(() => {
    if (user) {
      fetchUserProfile(user.id).then(data => setProfile(data))
    }
  }, [user])

  const isLoggedIn = Boolean(user && profile)

  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="fixed top-4 right-4 z-50 p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <Menu size={24} />
        </button>

        {isMenuOpen && (
          <div className="fixed right-0 top-0 h-full w-[64px] bg-sidebar-bg border-l border-sidebar-border z-20">
            <div className="h-full pt-16">
              <SidebarContent
                isCollapsed={true}
                pathname={pathname}
                profile={profile}
                isLoggedIn={isLoggedIn}
                showCollapseButton={false}
                onItemClick={() => setIsMenuOpen(false)}
              />
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <div className={`h-full border-r flex flex-col bg-sidebar-bg border-sidebar-border transition-all duration-200 ${isCollapsed ? "w-[64px]" : "w-[192px]"}`}>
      <SidebarContent
        isCollapsed={isCollapsed}
        pathname={pathname}
        profile={profile}
        isLoggedIn={isLoggedIn}
        onToggleCollapse={() => setIsCollapsed(prev => !prev)}
      />
    </div>
  )
}