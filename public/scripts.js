const randomHexColor = () =>
  '#000000'
    .replace(/0/g, () => (~~(Math.random() * 16)).toString(16))
    .toUpperCase();

const generatePalette = () => {
  $('.color-palette')
    .children()
    .each((index, element) => {
      $('#' + element.id)
        .css('background', randomHexColor)
        .find('#hex-color')
        .text(randomHexColor);
    });
};

$('#button-generate-palette').click(generatePalette);

$(document).ready(function() {
  generatePalette();
});
