export default function(text) {
  // Get the filter ID from the element's data attribute
  const filterId = text.getAttribute('data-filter');
  
  // Select the feGaussianBlur element within the filter
  const feBlur = document.querySelector(`#${filterId} feGaussianBlur`);
  
  if (!feBlur) {
    console.warn(`Filter with ID ${filterId} not found for element`, text);
    return;
  }

  // Apply the filter to the text element
  text.style.filter = `url(#${filterId})`;
  
  // Set initial opacity to 0
  gsap.set(text, { opacity: 0 });

  // Object to store the stdDeviation value for the blur filter
  let primitiveValues = { stdDeviation: 0 };

  // Create the animation timeline
  const animationTimeline = gsap.timeline({
    defaults: {
      duration: 2,
      ease: 'expo',
    },
    // On every update, set the stdDeviation attribute in the feGaussianBlur filter
    onUpdate: () => {
      feBlur.setAttribute('stdDeviation', primitiveValues.stdDeviation);
    },
    scrollTrigger: {
      trigger: text, // Trigger the animation when the text enters the viewport
      start: 'center bottom'
    }
  })
  .to(primitiveValues, {
    startAt: { stdDeviation: 50 }, 
    stdDeviation: 0 
  }, 0)
  .to(text, { 
    startAt: {
      opacity: 0 
    },
    opacity: 1 
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
