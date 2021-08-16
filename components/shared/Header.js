import NavLink from './NavLink';
import clsx from 'clsx';
// import hamburger from '@/helpers/hamburger';
import { useState, useEffect } from 'react';

const Header = ({page}) => {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const clsxHamburger = clsx(hamburgerOpen && 'clicked');

  function handleHamburger() {
    setHamburgerOpen(!hamburgerOpen);
  }


  return (
    <header className="header" id={`header-${page}`}>
        <nav className={clsxHamburger} id="header__main-nav">
            <div onClick={handleHamburger} className="header__main-nav--hamburger">
                <div className="line line-1"></div>
                <div className="line line-2"></div>
                <div className="line line-3"></div>
            </div>
            <ul className="header__main-nav--links">
              <NavLink hamburgerOpen cssSelector={clsx(page === 'home' && 'active')} src='/' name='Home' />
              <NavLink hamburgerOpen cssSelector={clsx(page === 'about' && 'active')} src='/about' name='About' />
              <NavLink hamburgerOpen cssSelector={clsx(page === 'skills' && 'active')} src='/skills' name='Skills' />
              <NavLink hamburgerOpen cssSelector={clsx(page === 'projects' && 'active')} src='/projects' name='Projects' />
              <NavLink hamburgerOpen cssSelector={clsx(page === 'contact' && 'active')} src='/contact' name='Contact' />
            </ul>
        </nav>
    </header>
  )
}

export default Header;