/**
 * showLoadingAnimation
 *
 * Loading animation that displays in your terminal.
 *
 * @param {Object} config - Config object for function to run.
 * @param {string} text - Text to display while loading.
 * @param {string[]} chars - Array of string characters to use for animation.
 * @param {number} delay - How quickly the animation should play.
 * @returns {number}
 */
function showLoadingAnimation({
  text = "",
  chars = ["⠙", "⠘", "⠰", "⠴", "⠤", "⠦", "⠆", "⠃", "⠋", "⠉"],
  delay = 100,
}) {
  let x = 0;

  return setInterval(function () {
    process.stdout.write("\r" + chars[x++] + " " + text);
    x = x % chars.length;
  }, delay);
}

module.exports = {
  showLoadingAnimation,
};
