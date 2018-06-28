const randomHexColor = () => {
  return '#000000'
    .replace(/0/g, () => (~~(Math.random() * 16)).toString(16))
    .toUpperCase();
};

const generatePalette = () => {
  $('.color-palette')
    .children()
    .each((index, colorCard) => {
      const $colorCard = $('#' + colorCard.id);
      const haveLockClass = $colorCard.find('.lock-icon').hasClass('locked');
      const color = randomHexColor();

      if (!haveLockClass) {
        $colorCard
          .css('background', color)
          .find('.hex-color')
          .text(color);
      }
    });
};

const getPaletteColors = () => {
  const color1 = $('#color-sample1').css('backgroundColor');
  const color2 = $('#color-sample2').css('backgroundColor');
  const color3 = $('#color-sample3').css('backgroundColor');
  const color4 = $('#color-sample4').css('backgroundColor');
  const color5 = $('#color-sample5').css('backgroundColor');
  const colorPalette = [color1, color2, color3, color4, color5];
  return colorPalette.map(rbg => convertToHex(rbg));
};

const convertToHex = rgb => {
  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  function hex(x) {
    return ('0' + parseInt(x).toString(16)).slice(-2);
  }
  return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
};

const colorizeTitle = () => {
  $('.title')
    .children()
    .each((index, letter) => {
      const $letter = $('#' + letter.id);
      $letter.css('color', randomHexColor);
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
  colorizeTitle();
});
