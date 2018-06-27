const randomHexColor = () =>
  '#000000'
    .replace(/0/g, () => (~~(Math.random() * 16)).toString(16))
    .toUpperCase();

const generatePalette = () => {
  $('.color-palette')
    .children()
    .each((index, element) => {
      const $element = $('#' + element.id);
      const haveLockClass = $element.find('.lock-icon').hasClass('locked');

      if (!haveLockClass) {
        $element
          .css('background', randomHexColor)
          .find('.hex-color')
          .text(randomHexColor);
      }
    });
};

const toggleLock = event => {
  const lockIcon = event.target;

  lockIcon.classList.toggle('locked');
  lockIcon.classList.contains('locked')
    ? (lockIcon.src = './assets/lock.svg')
    : (lockIcon.src = './assets/unlock.svg');
};

$('.lock-icon').click(() => toggleLock(event));
$('.generate-button').click(generatePalette);

$(document).ready(function() {
  generatePalette();
});
