import { Button } from "@/components/ui/button";
import { BarChart3, Bookmark, Settings, GraduationCap } from "lucide-react";
import { Link, useLocation } from "wouter";

export function BottomNavigation() {
  const [location] = useLocation();

  const navItems = [
    { 
      icon: GraduationCap, 
      label: "Study", 
      href: "/",
      isActive: location === "/" 
    },
    { 
      icon: BarChart3, 
      label: "Stats", 
      href: "/stats",
      isActive: location === "/stats" 
    },
    { 
      icon: Bookmark, 
      label: "Saved", 
      href: "/bookmarks",
      isActive: location === "/bookmarks" 
    },
    { 
      icon: Settings, 
      label: "Settings", 
      href: "/settings",
      isActive: location === "/settings" 
    },
  ];

  return (
    <nav className="bg-white border-t p-4">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={`flex flex-col items-center space-y-1 p-2 h-auto ${
                  item.isActive ? "text-primary" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
