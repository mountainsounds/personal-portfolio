import BaseLayout from '@/components/layouts/BaseLayout';
import Image from 'next/image';
import millarc from '@/public/millarc.png';
import Link from 'next/link'

const Projects = () => {
  return (
    <BaseLayout page='projects'>
        <section id="work">
            {/* <!-- Card 1 --> */}
            <div className="work__card">

                <div className="work__card--img">
                  <Link target='_blank' href='https://mountainsounds.github.io/millarc/#'>
                    <a> <Image src={millarc} alt='Artist's Portfolio /> </a>
                  </Link>
                </div>

                <div className="work__card--content">
                    <h3 className="work__card--content__title">VT Artist Portfolio</h3>
                    <p className="work__card--content__para">Designed and implemented with vanilla js, a small lightbox library, and "Email jS" to handle client side contact functionality. </p>
                </div>
            </div>

          {/* <!-- Card 2 --> */}
          <div className="work__card">
            <div className="work__card--img">
                <Link target='_blank' href='https://mountainsounds.github.io/millarc/#'>
                  <a> <Image src={millarc} alt='Artist's Portfolio /> </a>
                </Link>
            </div>
            <div className="work__card--content">
                <h3 className="work__card--content__title">JavaScript Sandbox</h3>
                <p className="work__card--content__para">A growing collection of small javascript projects to apply and reinforce learning. </p>
            </div>
          </div>

          {/* <!-- Card 3 --> */}
          <div className="work__card">
            <div className="work__card--img">
              <Link target='_blank' href='https://mountainsounds.github.io/millarc/#'>
                  <a> <Image src={millarc} alt='Artist's Portfolio /> </a>
              </Link>
            </div>
            <div className="work__card--content">
                <h3 className="work__card--content__title">Personal E-Commerce Site</h3>
                <p className="work__card--content__para">First website! A static, bootstrap heavy site that enabled me to showcase and sell a number of climbing-related items I was trying to sell.</p>
            </div>
           </div>

          {/* <!-- Card 4 --> */}
          <div className="work__card">
            <div className="work__card--img">
              <Link target='_blank' href='https://mountainsounds.github.io/millarc/#'>
                  <a> <Image src={millarc} alt='Artist's Portfolio /> </a>
              </Link>
            </div>
            <div className="work__card--content">
                <h3 className="work__card--content__title">This Portfolio Site</h3>
                <p className="work__card--content__para">Too meta? Involved modern CSS3 effects, emphasis on responsive design, DOM manipulation, ES6+ classNamees and syntax, etc.</p>
            </div>
        </div>
      </section>

    </BaseLayout>
  )
}

export default Projects;