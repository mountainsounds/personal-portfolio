import Link from 'next/link';

const NavLink = ({src, name, className, cssSelector}) => {

  return (
    <li>
      <Link href={src}>
        <a className={className} id={cssSelector} >{name}</a>
      </Link>
    </li>
  )
}

export default NavLink;