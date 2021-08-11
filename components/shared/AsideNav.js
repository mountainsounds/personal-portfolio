import Image from 'next/image';
import profilePic from '@/public/profile.jpg';
import { faGithub, faLinkedin, faYoutube} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AsideNav = ({page}) => {

  return (
    <aside className='side-nav' id={`sideNav-${page}`}>
      <div className='side-nav__content'>
        <div className="side_nav__content--logo">
          <div id='profilePic'>
            <Image src={profilePic} alt='Picture of the author' />
          </div>
        </div>
        <ul className="side-nav__content--social">
          <a><FontAwesomeIcon icon={faGithub} /></a>
          <a><FontAwesomeIcon icon={faLinkedin} /></a>
          <a><FontAwesomeIcon icon={faYoutube} /></a>
        </ul>
      </div>
    </aside>
  )
}

export default AsideNav;