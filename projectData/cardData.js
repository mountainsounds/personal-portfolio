import millarc from '@/public/millarc.png';
import ctThumb from '@/public/ctThumb.jpeg';

// ChalkTalk is a social networking web application geared towards climbers. Primary Features include:

// Authentication with client, server, and database validation.
// Post, follow users, like, and share functionality.
// Profile and cover photo upload, with built-in cropping editor using the Popper npm package.
// Notifications
// Individual and group real-time chat functionality utilizing Socket.io.

const cards = [
  {
    id: 1,
    link: 'https://chalktalk.azurewebsites.net/register',
    imgSrc: ctThumb,
    imgAlt: 'Screenshot of Website',
    title: 'Chalk Talk',
    description: 'A social networking site for rock climbers.',
    descriptionLong: 'ChalkTalk is a social networking web application geared towards climbers. Designed to help climbers find partners, share beta, and build community. User features include post, follow, like, share, notification, and profile functionality. Development features include ',
    videoOverview: 'https://www.youtube.com/embed/0V6M4i6UrO0',
    technologies:''
  },
  {
    id: 2,
    link: 'https://mountainsounds.github.io/millarc/#',
    imgSrc: millarc,
    imgAlt: 'Screenshot of Website',
    title: 'Millarc',
    description: 'A Vermont Artists Portfolio.',
    descriptionLong: '',
    technologies:''
  },
  {
    id: 1,
    link: 'https://mountainsounds.github.io/millarc/#',
    imgSrc: millarc,
    imgAlt: 'Screenshot of Website',
    title: 'Sieve of Eratosthenes',
    description: 'A visual demonstration.',
    descriptionLong: '',
    technologies:''
  },
]

export default cards