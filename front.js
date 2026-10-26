function getResultsAtTop(spinnerElement) {
  if (!spinnerElement) return null;
  
  const rect = spinnerElement.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const topY = rect.top + (.05 * rect.height); // the arrow is 4%, so we use 5%
  const element = document.elementFromPoint(centerX, topY);
  if (element?.parentElement?.parentElement !== spinnerElement) return null;
  return element?.textContent?.trim() || null;
}

function wheelOfFortune(node) {
  if (!node) return;

  const spin = node.querySelector('button');
  const wheel = node.querySelector('ul');
  let animation;
  let previousEndDegree = 0;

  spin.addEventListener('click', () => {
    if (animation) {
      animation.cancel(); // Reset the animation if it already exists
    }

    const randomAdditionalDegrees = Math.random() * 360 + 1800;
    const newEndDegree = previousEndDegree + randomAdditionalDegrees;

    animation = wheel.animate([
      { transform: `rotate(${previousEndDegree}deg)` },
      { transform: `rotate(${newEndDegree}deg)` }
    ], {
      duration: 4000,
      direction: 'normal',
      easing: 'cubic-bezier(0.440, -0.205, 0.000, 1.130)',
      fill: 'forwards',
      iterations: 1
    });

    previousEndDegree = newEndDegree;
    animation.onfinish = () => {
      const currentValue = getResultsAtTop(node);
      spin.textContent = currentValue;
    };
  });
}

// Usage
document.querySelectorAll('.ui-wheel-of-fortune').forEach(el => wheelOfFortune(el))
// wheelOfFortune('.ui-wheel-of-fortune');
