import Link from 'next/link';

const NavLink = ({src, name, className}) => {

  return (
    <li>
      <Link href={src}>
        <a className={className}>{name}</a>
      </Link>
    </li>
  )
}

export default NavLink;