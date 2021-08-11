import NavLink from './NavLink';

const Header = ({page}) => {

  return (
    <header className="header" id={`header-${page}`}>
        <nav id="header__main-nav">
            <div className="header__main-nav--hamburger">
                <div className="line line-1"></div>
                <div className="line line-2"></div>
                <div className="line line-3"></div>
            </div>
            <ul className="header__main-nav--links">
              <NavLink src='/' name='Home' />
              <NavLink src='/about' name='About' />
              <NavLink src='/skills' name='Skills' />
              <NavLink src='/projects' name='Projects' />
              <NavLink src='/contact' name='Contact' />
            </ul>
        </nav>
    </header>
  )
}

export default Header;