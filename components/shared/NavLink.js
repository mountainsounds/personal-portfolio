import Link from 'next/link';

const NavLink = ({src, name, cssSelector}) => {

  return (
    <li>
      <Link href={src}>
        <a id={cssSelector} >{name}</a>
      </Link>
    </li>
  )
}

export default NavLink;