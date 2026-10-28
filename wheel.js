function getResultsAtTop(spinnerElement) {
  if (!spinnerElement) return null;

  const rect = spinnerElement.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const topY = rect.top + (0.05 * rect.height); // Arrow sits at 4%-5%
  const element = document.elementFromPoint(centerX, topY);
  if (element?.parentElement?.parentElement !== spinnerElement) return null;
  return element?.textContent?.trim() || null;
}

function wheelOfFortune(node, onSpinComplete) {
  if (!node) return;

  const spin = node.querySelector('button');
  const wheel = node.querySelector('ul');
  let animation;
  let previousEndDegree = 0;

  spin.addEventListener('click', () => {
    // Respect turn lock
    if (window.gameState && !window.gameState.canSpin) {
      return;
    }

    if (window.gameState) {
      window.gameState.canSpin = false;
    }

    if (animation) {
      animation.cancel();
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

      if (typeof onSpinComplete === 'function') {
        onSpinComplete(currentValue);
      }
    };
  });
}