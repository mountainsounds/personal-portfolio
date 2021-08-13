import Link from 'next/link';
import Image from 'next/image';
// import { useRouter } from 'next/router';

const ProjectCard = (props) => {
  const {id, link, imgSrc, imgAlt, title, description} = props.card;

  return (
    <div className="work__card">

        <div className="work__card--img">
          {/* <Link target='_blank' href={link}> */}
            {/* <a>  */}
              <Image src={imgSrc} alt={imgAlt} />

        </div>

        <div className="work__card--content">
            <h3 className="work__card--content__title"> {title} </h3>
            <p className="work__card--content__para"> {description} </p>
            <Link href={`/projects/${id}`} >
              <a className='exploreBtn'>Explore </a>
            </Link>

        </div>
    </div>
  )
}

export default ProjectCard;