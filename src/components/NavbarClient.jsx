"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import NextLink from "next/link";
import {
  Avatar,
  Button,
  Dropdown,
  Header,
  Label,
  Separator,
} from "@heroui/react";
import {
  ChefHat,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { ThemeSwitch } from "./ThemeSwitch";

const PUBLIC_LINKS = [
  { label: "Home", href: "/" },
  { label: "Browse Recipes", href: "/recipes" },
];

export default function NavbarClient({ user }) {
 
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

 // Close the mobile panel on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);


  const links = user
    ? [...PUBLIC_LINKS, { label: "Dashboard", href: "/dashboard" }]
    : PUBLIC_LINKS;

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success("Logged out successfully");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Couldn't log you out. Please try again.");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-separator bg-background/80 backdrop-blur-lg">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <NextLink href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <ChefHat className="size-4.5" strokeWidth={2.25} />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            <span className="text-foreground">Recipe</span>
            <span className="text-accent">Hub</span>
          </span>
        </NextLink>

        {/* Desktop nav links */}
        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <NextLink
                href={link.href}
                className="flex flex-col items-center gap-1 px-3 py-2 text-sm font-medium text-foreground/75 transition-colors hover:text-foreground"
              >
                {link.label}
                <span
                  className={`size-1 rounded-full bg-accent transition-opacity ${isActive(link.href) ? "opacity-100" : "opacity-0"
                    }`}
                />
              </NextLink>
            </li>
          ))}
        </ul>

        {/* Desktop right side */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeSwitch />

          {user ? (
            <Dropdown>
              <Dropdown.Trigger
                aria-label="Account menu"
                className="flex items-center gap-1.5 rounded-full py-1 pl-1 pr-2.5 transition-colors hover:bg-surface"
              >
                <Avatar className="size-8">
                  <Avatar.Image src={user.image} alt={user.name ?? "User"} />
                  <Avatar.Fallback delayMs={300}>
                    {(user.name?.charAt(0) || "U").toUpperCase()}
                  </Avatar.Fallback>
                </Avatar>
                <ChevronDown className="size-3.5 text-muted" />
              </Dropdown.Trigger>
              <Dropdown.Popover>
                <Dropdown.Menu
                  onAction={(key) => {
                    if (key === "dashboard") router.push("/dashboard");
                    if (key === "profile") router.push("/dashboard/profile");
                    if (key === "logout") handleLogout();
                  }}
                >
                  <Dropdown.Section>
                    <Header>{user.name ?? "My account"}</Header>
                    <Dropdown.Item id="dashboard" textValue="Dashboard">
                      <LayoutDashboard className="size-4 text-muted" />
                      <Label>Dashboard</Label>
                    </Dropdown.Item>
                    <Dropdown.Item id="profile" textValue="Profile">
                      <UserRound className="size-4 text-muted" />
                      <Label>Profile</Label>
                    </Dropdown.Item>
                  </Dropdown.Section>
                  <Separator />
                  <Dropdown.Item id="logout" textValue="Log out" variant="danger">
                    <LogOut className="size-4" />
                    <Label>Log out</Label>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                render={(domProps) => <NextLink {...domProps} href="/login" />}
              >
                Log in
              </Button>
              <Button
                variant="primary"
                size="sm"
                render={(domProps) => <NextLink {...domProps} href="/register" />}
              >
                Sign up
              </Button>
            </>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeSwitch />
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className="flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface"
          >
            {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu panel */}
      <div
        className={`overflow-hidden border-separator transition-[max-height] duration-300 ease-in-out md:hidden ${isOpen ? "max-h-112 border-t" : "max-h-0"
          }`}
      >
        <ul className="flex flex-col gap-1 px-4 py-3">
          {links.map((link) => (
            <li key={link.href}>
              <NextLink
                href={link.href}
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive(link.href)
                  ? "bg-surface text-accent"
                  : "text-foreground/80 hover:bg-surface"
                  }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="size-1.5 rounded-full bg-accent" />
                )}
              </NextLink>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-2 border-t border-separator px-4 py-3">
          {user ? (
            <>
              <NextLink
                href="/dashboard/profile"
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-surface"
              >
                <UserRound className="size-4" /> Profile
              </NextLink>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-danger hover:bg-surface"
              >
                <LogOut className="size-4" /> Log out
              </button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="w-full"
                render={(domProps) => <NextLink {...domProps} href="/login" />}
              >
                Log in
              </Button>
              <Button
                variant="primary"
                className="w-full"
                render={(domProps) => <NextLink {...domProps} href="/register" />}
              >
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}