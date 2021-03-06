/************************* Type Writing Effect **********************/
// ES6 Class
class TypeWriter {
  constructor(setCurrentWord, words, wait = 3000) {
    this.setCurrentWord = setCurrentWord;
    this.words = words;
    this.txt = '';
    this.wordIndex = 0;
    this.wait = parseInt(wait, 10);
    this.type();
    this.isDeleting = false;
  }

  type() {
    // Current index of word
    const current = this.wordIndex % this.words.length;
    // Get full text of current word
    const fullTxt = this.words[current];

    // Check if deleting
    if(this.isDeleting) {
      // Remove char
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      // Add char
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    // Insert txt into element
    this.setCurrentWord(this.txt)
    // this.txtElement.innerHTML = `<span className="txt">${this.txt}</span>`;

    // Initial Type Speed
    let typeSpeed = 300;

    if(this.isDeleting) {
      typeSpeed /= 3;
    }

    // If word is complete
    if(!this.isDeleting && this.txt === fullTxt) {
      // Make pause at end
      typeSpeed = this.wait;
      // Set delete to true
      this.isDeleting = true;
    } else if(this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      // Move to next word
      this.wordIndex++;
      // Pause before start typing
      typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

// Init App
export default function init(setCurrentWord) {
  const words = ['Developer', 'Tech Lover', 'Team Player', 'Outdoor Enthusiast', 'Climber' ]
  const wait = 3000;
  // Init TypeWriter
  new TypeWriter(setCurrentWord, words, wait);
}