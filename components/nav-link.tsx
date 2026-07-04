import Link from "next/link";
import clsx from "clsx";

type NavLinkProps = {
  src: string;
  name: string;
  className?: string;
  /** Marks the link for the current page; the stylesheet underlines `#active`. */
  active?: boolean;
  /** Header links animate in/out with the hamburger via the `fade` class. */
  fade?: boolean;
};

export default function NavLink({
  src,
  name,
  className,
  active,
  fade,
}: NavLinkProps) {
  return (
    <li className={clsx(fade && "fade")}>
      <Link href={src} className={className} id={active ? "active" : undefined}>
        {name}
      </Link>
    </li>
  );
}
