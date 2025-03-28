"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Search, User, Settings, HelpCircle, Bookmark, RedoDotIcon as RedditIcon } from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname();
  
  const mainNavItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/saved', label: 'Saved', icon: <Bookmark size={18} /> },
    // { path: '/search', label: 'Search', icon: <Search size={20} /> },
    { path: '/account', label: 'Account', icon: <User size={18} /> },
  ];

  return (
    <div className="w-[192px] h-full border-r flex flex-col bg-sidebar-bg border-sidebar-border">
      <div className="p-6">
        <Link href="/">
          <h1 className="text-2xl font-black font-roboto italic cursor-pointer">
            <span className="text-brand" >Super</span>
            <br />
            <span className="text-brand" >Red</span>
          </h1>
        </Link>
      </div>
      
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.path}>
                <Link 
                  href={item.path} 
                  className={`flex items-center p-2 px-4 text-sm rounded-xl transition-colors ${
                    isActive 
                      ? 'text-accent  bg-sidebar-item-bg' 
                      : 'text-secondary hover:bg-sidebar-item-bg'
                  }`}

                >
                  <span className="mr-3">
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-black font-medium bg-accent">
            ZY
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-primary">Zoe Yan</p>
          </div>
        </div>
      </div>
    </div>
  )
}

