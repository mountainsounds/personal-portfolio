import type { ReactNode } from "react";

import AsideNav from "@/components/aside-nav";
import Header from "@/components/header";

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

export default function SiteShell({ page, children }: SiteShellProps) {
  return (
    <div className="body" id={`body-${page}`}>
      <AsideNav page={page} />
      <main>
        <Header page={page} />
        {children}
      </main>
    </div>
  );
}
