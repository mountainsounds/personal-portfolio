import Image from 'next/image';
import profilePic from '@/public/profile.jpg';
import { faGithub, faLinkedin, faYoutube} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

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
          <Link href='https://github.com/mountainsounds'>
            <a target='_blank'> <FontAwesomeIcon icon={faGithub} /></a>
          </Link>
          <Link href='https://www.linkedin.com/in/zack-sawyer-mountain-sounds/'>
            <a target='_blank'><FontAwesomeIcon icon={faLinkedin} /></a>
          </Link>
          <Link href='https://www.youtube.com/channel/UC-t1xXxxGfnFZEpR-2PprwA'>
            <a target='_blank'><FontAwesomeIcon icon={faYoutube} /></a>
          </Link>
        </ul>
      </div>
    </aside>
  )
}

export default AsideNav;