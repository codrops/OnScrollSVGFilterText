export default function(text) {
  // Get the filter ID from the element's data attribute
  const filterId = text.getAttribute('data-filter');
  
  // Select the necessary SVG filter elements
  const feBlur = document.querySelector(`#${filterId} feGaussianBlur`);
  const feTurbulence = document.querySelector(`#${filterId} feTurbulence`);
  const feDisplacementMap = document.querySelector(`#${filterId} feDisplacementMap`);

  // Check if required elements exist
  if (!feBlur || !feDisplacementMap) {
    console.warn(`Filter with ID ${filterId} not found for element`, text);
    return;
  }

  // Apply the filter to the text element
  text.style.filter = `url(#${filterId})`;

  // Object to store the values for blur, scale, and turbulence frequency
  let primitiveValues = { stdDeviation: 0, scale: 0, baseFrequency: 0 };
  
  // Set initial opacity to 0
  gsap.set(text, { opacity: 0 });

  // Create the animation timeline
  const animationTimeline = gsap.timeline({
    defaults: {
      duration: 2,
      ease: 'expo',
    },
    // On every update, set the appropriate attributes in the SVG filters
    onUpdate: () => {
      feBlur.setAttribute('stdDeviation', primitiveValues.stdDeviation);
      feDisplacementMap.setAttribute('scale', primitiveValues.scale);
      feTurbulence.setAttribute('baseFrequency', primitiveValues.baseFrequency);
    },
    scrollTrigger: {
      trigger: text, // Trigger the animation when the text enters the viewport
      start: 'center bottom'
    }
  })
  .to(primitiveValues, { 
    startAt: { 
      stdDeviation: 90,
      scale: 300,  
      baseFrequency: 0.1 
    },
    stdDeviation: 0,  
    scale: 0,
    baseFrequency: 0.01
  }, 0)
  .to(text, { 
    startAt: {
      opacity: 0,
      scaleX: 2.4
    },
    opacity: 1,
    scaleX: 1
  }, 0);

  // Find the corresponding replay button (assumes button is the next sibling)
  const replayButton = text.nextElementSibling;

  // Add click event listener to the replay button
  if (replayButton && replayButton.classList.contains('replay')) {
    replayButton.addEventListener('click', () => {
      // Restart the timeline when the button is clicked
      animationTimeline.restart();
    });
  }
}
