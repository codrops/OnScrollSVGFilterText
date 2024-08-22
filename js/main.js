import { preloadImages } from './utils.js';

// Select all elements that have the data-filter attribute
const elements = [...document.querySelectorAll('[data-filter]')];

// A Set to keep track of the scripts that have already been imported
const importedScripts = new Set();

// Function to initialize animations and scripts
const init = async () => {
  // Select all elements with the class .deco__item
  const decoItems = document.querySelectorAll('.deco__item');

  // Loop through all .deco__item elements
  decoItems.forEach((item) => {
    // Generate a random translation value for the y-axis
    const randomY = Math.random() * 100 - 50; // Random value between -50% and 50%

    // Apply ScrollTrigger animation to translate the element on the y-axis
    gsap.to(item, {
      yPercent: randomY, // Apply the random y-axis translation
      scrollTrigger: {
        trigger: item, // Trigger animation when the item enters the viewport
        start: 'top bottom', // Start the animation when the top of the item reaches the bottom of the viewport
        end: 'bottom top', // End the animation when the bottom of the item reaches the top of the viewport
        scrub: true, // Smoothly scrub the animation with the scroll
      },
    });
  });
  
  // Loop through all elements with the data-filter attribute
  for (const element of elements) {
    // Get the script name from the data-script attribute
    const scriptName = element.getAttribute('data-script');

    if (scriptName) {
      // Check if the script has already been imported
      if (!importedScripts.has(scriptName)) {
        try {
          // Dynamically import the script and mark it as imported
          const module = await import(`./${scriptName}.js`);
          importedScripts.add(scriptName);
          // Initialize the specific animation for this element
          module.default(element);
        } catch (error) {
          console.error(`Failed to load script: ${scriptName}.js`, error);
        }
      } else {
        // If the script is already imported, just initialize the animation
        const module = await import(`./${scriptName}.js`);
        module.default(element);
      }
    }
  }
};

// Call the init function to start the animations
init();

// Preloading images and initializing setup when complete
preloadImages('.deco__item').then(() => document.body.classList.remove('loading')); // Remove the loading class from the body
