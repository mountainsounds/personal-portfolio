import type { ReactNode } from "react";

import AsideNav from "@/components/aside-nav";
import Header from "@/components/header";
import SiteFooter from "@/components/site-footer";

/**
 * Page identifiers double as styling hooks: the stylesheet themes each route
 * through `#body-<page>`, `#sideNav-<page>`, and `#header-<page>` selectors.
 */
export type PageId =
  "home" | "about" | "skills" | "projects" | "projects-detail" | "contact";

type SiteShellProps = {
  page: PageId;
  children: ReactNode;
};

/* Home and contact fill the viewport exactly; a footer would force scroll. */
const FOOTERLESS_PAGES: ReadonlySet<PageId> = new Set(["home", "contact"]);

export default function SiteShell({ page, children }: SiteShellProps) {
  return (
    <div className="body" id={`body-${page}`}>
      <AsideNav page={page} />
      <main>
        <Header page={page} />
        {children}
        {!FOOTERLESS_PAGES.has(page) && <SiteFooter />}
      </main>
    </div>
  );
}
