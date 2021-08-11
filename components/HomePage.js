import typingEffect from '@/helpers/typingEffect';
import { useState, useEffect } from 'react';
import NavLink from '@/components/shared/NavLink';

const HomePage = () => {
  const [currentWord, setCurrentWord] = useState('');

  useEffect(() => {
    typingEffect(setCurrentWord);
  }, [])




  return (
    <section id="showcase">
        <div className="showcase__content">
            <h1 className="showcase__content--title">Zack Sawyer</h1>
            <p className="showcase__content--para">{currentWord}</p>
            <NavLink src='/projects' name='My Work' className='showcase__content--link'/>
        </div>
    </section>
  )
}

export default HomePage;