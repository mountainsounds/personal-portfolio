"use client";

import { useState } from "react";
import clsx from "clsx";

import NavLink from "@/components/nav-link";
import type { PageId } from "@/components/site-shell";

const navItems = [
  { src: "/", name: "Home", page: "home" },
  { src: "/about", name: "About", page: "about" },
  { src: "/skills", name: "Skills", page: "skills" },
  { src: "/projects", name: "Projects", page: "projects" },
  { src: "/contact", name: "Contact", page: "contact" },
] as const;

export default function Header({ page }: { page: PageId }) {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  return (
    <header className="header" id={`header-${page}`}>
      {/* Deliberately OUTSIDE the drawer <nav>: the drawer's backdrop-filter
          makes it the containing block for fixed descendants (per spec; iOS
          Safari enforces it), which would drag the button offscreen with it. */}
      <button
        type="button"
        onClick={() => setHamburgerOpen((open) => !open)}
        className={clsx(
          "header__main-nav--hamburger",
          hamburgerOpen && "clicked",
        )}
        aria-label={hamburgerOpen ? "Close menu" : "Open menu"}
        aria-expanded={hamburgerOpen}
        aria-controls="header__main-nav"
      >
        <div className="line line-1"></div>
        <div className="line line-2"></div>
        <div className="line line-3"></div>
      </button>
      <nav className={clsx(hamburgerOpen && "clicked")} id="header__main-nav">
        <ul className="header__main-nav--links">
          {navItems.map((item) => (
            <NavLink
              key={item.page}
              fade
              active={page === item.page}
              src={item.src}
              name={item.name}
            />
          ))}
        </ul>
      </nav>
    </header>
  );
}
