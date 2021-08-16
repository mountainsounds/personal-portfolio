import Link from 'next/link';
import clsx from 'clsx';

const NavLink = ({src, name, className, cssSelector, hamburgerOpen}) => {
  const navLinks = clsx(hamburgerOpen && 'fade')

  return (
    <li className={navLinks}>
      <Link href={src}>
        <a className={className} id={cssSelector} >{name}</a>
      </Link>
    </li>
  )
}

export default NavLink;