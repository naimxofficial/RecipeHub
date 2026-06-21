import NextLink from "next/link";
import {
  ChefHat,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Browse Recipes", href: "/recipes" },
  { label: "Add Recipe", href: "/dashboard/add-recipe" },
  { label: "My Favorites", href: "/dashboard/favorites" },
  { label: "Dashboard", href: "/dashboard" },
];

// Swap these hrefs for your real profiles
const SOCIAL_LINKS = [
  { label: "Instagram", href: "#", icon: FaInstagram },
  { label: "Facebook", href: "#", icon: FaFacebook },
  { label: "Twitter", href: "#", icon: BsTwitterX },
  { label: "YouTube", href: "#", icon: FaYoutube },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-separator bg-surface text-surface-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <NextLink href="/" className="flex w-fit items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <ChefHat className="size-[18px]" strokeWidth={2.25} />
              </span>
              <span className="font-display text-lg font-bold tracking-tight">
                <span className="text-surface-foreground">Recipe</span>
                <span className="text-accent">Hub</span>
              </span>
            </NextLink>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              Recipes worth coming back to. Cook, share, and discover dishes
              from a community that actually eats what it makes.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-background hover:text-accent"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-sm font-semibold tracking-wide text-surface-foreground">
              Quick Links
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <NextLink
                    href={link.href}
                    className="group flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
                  >
                    <span className="size-1 rounded-full bg-accent opacity-0 transition-opacity group-hover:opacity-100" />
                    {link.label}
                  </NextLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-display text-sm font-semibold tracking-wide text-surface-foreground">
              Contact
            </h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-muted">
              <li>
                <a
                  href="mailto:support@recipehub.com"
                  className="flex items-center gap-2.5 transition-colors hover:text-accent"
                >
                  <Mail className="size-4 shrink-0" />
                  support@recipehub.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+15550142024"
                  className="flex items-center gap-2.5 transition-colors hover:text-accent"
                >
                  <Phone className="size-4 shrink-0" />
                  +1 (555) 014-2024
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                <span>142 Market Street, Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center gap-3 border-t border-separator pt-6 text-xs text-muted sm:flex-row sm:justify-between">
          <p>© {year} RecipeHub. All rights reserved.</p>
          <p>Made for people who actually cook.</p>
        </div>
      </div>
    </footer>
  );
}