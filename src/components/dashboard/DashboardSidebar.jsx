"use client";

import { useState, useEffect } from "react";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar } from "@heroui/react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import {
  FaChartPie,
  FaBookBookmark,
  FaPlus,
  FaHeart,
  FaBagShopping,
  FaCircleUser,
  FaUsers,
  FaUtensils,
  FaFlag,
  FaReceipt,
  FaRightFromBracket,
  FaBars,
  FaXmark,
  FaCrown,
} from "react-icons/fa6";
import { ChefHat } from "lucide-react";

const USER_LINKS = [
  { label: "Overview",           href: "/dashboard",           icon: FaChartPie },
  { label: "My Recipes",        href: "/dashboard/my-recipes",   icon: FaBookBookmark },
  { label: "Add Recipe",        href: "/dashboard/add-recipe",   icon: FaPlus },
  { label: "My Favorites",      href: "/dashboard/favorites",    icon: FaHeart },
  { label: "Purchased Recipes", href: "/dashboard/purchased",    icon: FaBagShopping },
  { label: "Profile",           href: "/dashboard/profile",      icon: FaCircleUser },
];

const ADMIN_LINKS = [
  { label: "Overview",       href: "/dashboard",               icon: FaChartPie },
  { label: "Manage Users",   href: "/dashboard/admin/users",   icon: FaUsers },
  { label: "Manage Recipes", href: "/dashboard/admin/recipes", icon: FaUtensils },
  { label: "Reports",        href: "/dashboard/admin/reports", icon: FaFlag },
  { label: "Transactions",   href: "/dashboard/admin/transactions", icon: FaReceipt },
];

function NavLink({ href, icon: Icon, label, onClick }) {
  const pathname = usePathname();
  const isActive =
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  return (
    <NextLink
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
        isActive
          ? "bg-accent text-accent-foreground"
          : "text-surface-foreground hover:bg-background hover:text-accent"
      }`}
    >
      <Icon className="size-4 shrink-0" />
      {label}
    </NextLink>
  );
}


function SidebarContent({ user, links, handleLogout, onLinkClick }) {

  return (
    <div className="flex h-full flex-col">
      {/* User info */}
      <div className="border-b border-separator p-5">
        <div className="flex items-center gap-3">
          {/* 2. FIXED: Corrected Hero UI Avatar API implementation */}
          <Avatar className="size-8">
                  <Avatar.Image src={user.image} referrerPolicy='no-referrer' alt={user.name ?? "User"} />
                  <Avatar.Fallback delayMs={300}>
                    {(user.name?.charAt(0) || "U").toUpperCase()}
                  </Avatar.Fallback>
                </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-sm font-semibold text-surface-foreground">
                {user?.name ?? "User"}
              </p>
              {user?.isPremium && (
                <FaCrown className="size-3 shrink-0 text-warning" />
              )}
            </div>
            <p className="truncate text-xs text-muted">{user?.email}</p>
          </div>
        </div>

        {/* Role badge */}
        <div className="mt-3">
          {user?.role === "admin" ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
              <ChefHat  className="size-3" />
              Admin
            </span>
          ) : user?.isPremium ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/10 px-3 py-1 text-xs font-semibold text-warning">
              <FaCrown className="size-3" />
              Premium member
            </span>
          ) : (
            <NextLink
              href="/dashboard/premium"
              className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-warning/60 px-3 py-1 text-xs font-medium text-warning/80 transition-colors hover:bg-warning/10"
            >
              <FaCrown className="size-3" />
              Upgrade to Premium
            </NextLink>
          )}
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="flex flex-col gap-1">
          {links.map((link) => (
            <li key={link.href}>
              <NavLink {...link} onClick={onLinkClick} />
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="border-t border-separator p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-background hover:text-danger"
        >
          <FaRightFromBracket className="size-4 shrink-0" />
          Log out
        </button>
      </div>
    </div>
  );
}

export default function DashboardSidebar({ user }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer cleanly on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const links = user?.role === "admin" ? ADMIN_LINKS : USER_LINKS;

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success("Logged out successfully");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Couldn't log out. Please try again.");
    }
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex h-14 items-center justify-between border-b border-separator bg-surface px-4 lg:hidden">
        <span className="font-display text-sm font-bold text-surface-foreground">
          {user?.role === "admin" ? "Admin Dashboard" : "Dashboard"}
        </span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex size-9 items-center justify-center rounded-full text-muted hover:bg-background hover:text-foreground"
        >
          {open ? <FaXmark className="size-4" /> : <FaBars className="size-4" />}
        </button>
      </div>

      {/* Mobile drawer backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-surface shadow-xl transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent 
          user={user} 
          links={links} 
          handleLogout={handleLogout} 
          onLinkClick={() => setOpen(false)} 
        />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-separator bg-surface lg:block">
        <div className="sticky top-16 h-[calc(100vh-4rem)]">
          <SidebarContent 
            user={user} 
            links={links} 
            handleLogout={handleLogout} 
            onLinkClick={undefined} 
          />
        </div>
      </aside>
    </>
  );
}