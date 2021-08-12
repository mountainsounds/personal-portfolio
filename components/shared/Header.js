import NavLink from './NavLink';
import clsx from 'clsx';

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
              <NavLink cssSelector={clsx(page === 'home' && 'active')} src='/' name='Home' />
              <NavLink cssSelector={clsx(page === 'about' && 'active')} src='/about' name='About' />
              <NavLink cssSelector={clsx(page === 'skills' && 'active')} src='/skills' name='Skills' />
              <NavLink cssSelector={clsx(page === 'projects' && 'active')} src='/projects' name='Projects' />
              <NavLink cssSelector={clsx(page === 'contact' && 'active')} src='/contact' name='Contact' />
            </ul>
        </nav>
    </header>
  )
}

export default Header;