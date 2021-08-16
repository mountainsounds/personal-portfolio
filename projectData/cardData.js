import millarc from '@/public/millarc.png';
import chalkTalk from '@/public/chalkTalk.png';
import sieveE from '@/public/sieveE.png';
import personalPortfolio from '@/public/personalPortfolio.png';



const cards = [
  {
    id: 1,
    link: 'https://chalktalk.azurewebsites.net/register',
    sourceCode: 'https://github.com/mountainsounds/ChalkTalk',
    imgSrc: chalkTalk,
    imgAlt: 'Screenshot of Website',
    title: 'Chalk Talk',
    description: 'A social networking site for rock climbers.',
    descriptionLong: 'ChalkTalk is a social networking web application geared towards climbers. Designed to help climbers find partners, share beta, and build community.',
    userFeatures: 'User features include post, follow, like, share, and notification functionality. Additionally, users can upload profile and cover photos with a built-in cropping editor.',
    developmentFeatures: 'Development features include authentication with client, server, and database validation. Individual and group real-time chat functionality occurs via WebSockets utilizing Socket.io.',
    videoOverview: 'https://www.youtube.com/embed/0V6M4i6UrO0',
    technologies:'Pug, Sass, JavaScript, Node/Express, Bootstrap / jQuery, MongoDB Atlas, Socket.io, Microsoft Azure'
  },
  {
    id: 2,
    link: 'https://mountainsounds.github.io/millarc/#',
    sourceCode: 'https://github.com/mountainsounds/millarc',
    imgSrc: millarc,
    imgAlt: 'Screenshot of Website',
    title: 'Millarc',
    description: "A Vermont Artist's Portfolio.",
    descriptionLong: 'A website re-design proposal for a noted abstract VT artist.',
    userFeatures: 'Implemented with vanilla JavaScript and DOM manipulation to provide a single page application user experience. Designed mobile-first.',
    developmentFeatures: "Development features include a small lightbox library, and EmailJS to provide client-side email/message functionality without server overhead code.",
    technologies:'ES6+ JavaScript, CSS, EmailJS'
  },
  {
    id: 3,
    link: 'https://mountainsounds.github.io/sieveAlgoDemo/',
    sourceCode: 'https://github.com/mountainsounds/sieveAlgoDemo',
    imgSrc: sieveE,
    imgAlt: 'Screenshot of Website',
    title: 'Sieve of Eratosthenes',
    description: 'A visual demonstration.',
    descriptionLong: "An interactive, JavaScript-centered, visual demonstration of the famous prime number finding algorithm, the 'Sieve of Eratosthenes.'",
    developmentFeatures: "Utilizes the code syntax highlighting library PrismJS to display the algorithim's code in a visualy appealing manner.",
    technologies:'ES6+ JavaScript, Concurrency, Advanced DOM Manipulation, PrismJS'
  },
  {
    id: 4,
    link: 'http://www.mtnsounds.com/',
    sourceCode: 'https://github.com/mountainsounds/personal-portfolio',
    imgSrc: personalPortfolio,
    imgAlt: 'Screenshot of Website',
    title: 'Personal Portfolio',
    description: 'Meta, I know!',
    descriptionLong: 'A major redesign of my personal website. Refactored the existing static site to use React & Next.js. Deployed to Vercel. EmailJS handles client-side contact functionality.',
    userFeatures: 'Emphasis on responsive design, and vanilla, modern CSS3 effects without additional styling libraries.',
    technologies:'React, Next.js, Vanilla CSS + Sass, Vercel, EmailJS'
  },
]

export default cards