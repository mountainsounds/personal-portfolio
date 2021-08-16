import BaseLayout from '@/components/layouts/BaseLayout';
import Image from 'next/image';
import climbingProfile from '@/public/climbingprofile.jpeg';

const About = () => {
  return (
    <BaseLayout page='about'>
      <section id="about-me">
        <div className="about-me__img">
            <Image src={climbingProfile} alt='Picture of the author climbing' />
            {/* <img src="img/climbingprofile.jpeg" alt="a profile photo of me"> */}
        </div>
        <div className="about-me__content">
            <h2 className="about-me__content--title">About Me</h2>
            <p className="about-me__content--para">
               Growing up in rural Vermont, I enjoyed New England&apos;s simple pleasures and more maple syrup than is probably good for one. While attaining a degree in Philosophy, far from the hills and granite cliffs of home, I became a climber. Upon graduating, I pursued training and certification with the American Mountain Guides Association and began to teach, coach, and guide new and experienced climbers alike throughout the U.S.
            </p>
            <p className="about-me__content--para">
                Teaching others to climb, I realized that learning any new skill simply required time, diligent practice, and effective teaching. I began to think about fresh, professional possibilities, and fell upon software development. Solving a bug, or attempting to implement an idea reminded me of the process of succeeding on a hard climb. It required a similar mix of methodical approach, personal style, and often, simply a good night&apos;s sleep!

            </p>
            <p className="about-me__content--para">
                While eagerly exploring this new world, my learning was motivated by building applications that merged these two passions together: climbing and coding. My exposure to software engineering has kindled a broader, more universal desire as well: to address problems and bring some order to a chaotic world, hopefully enriching lives in the process.
            </p>

            <p className="about-me__content--para">
                I hope you enjoy your time here, and please don&apos;t hesitate to get in touch to chat, collaborate, or even spend a few hours climbing happily over warm rock!
            </p>

        </div>
      </section>
    </BaseLayout>
  )
}

export default About;
