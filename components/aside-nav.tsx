import Image from "next/image";

import { GitHubIcon, LinkedInIcon, YouTubeIcon } from "@/components/icons";
import type { PageId } from "@/components/site-shell";
import profilePic from "@/public/profile.jpg";

const socialLinks = [
  {
    href: "https://github.com/mountainsounds",
    label: "GitHub",
    Icon: GitHubIcon,
  },
  {
    href: "https://www.linkedin.com/in/zack-sawyer-mountain-sounds/",
    label: "LinkedIn",
    Icon: LinkedInIcon,
  },
  {
    href: "https://www.youtube.com/channel/UC-t1xXxxGfnFZEpR-2PprwA",
    label: "YouTube",
    Icon: YouTubeIcon,
  },
];

export default function AsideNav({ page }: { page: PageId }) {
  return (
    <aside className="side-nav" id={`sideNav-${page}`}>
      <div className="side-nav__content">
        <div className="side_nav__content--logo">
          <div id="profilePic">
            {/* The stylesheet sizes only the container, so the image must
                scale itself (the legacy <Image> wrapper did this implicitly). */}
            <Image
              src={profilePic}
              alt="Picture of the author"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </div>
        <ul className="side-nav__content--social">
          {socialLinks.map(({ href, label, Icon }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
            >
              <Icon />
            </a>
          ))}
        </ul>
      </div>
    </aside>
  );
}
