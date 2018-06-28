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

// const getPaletteColors = () => {
//   const color1 = $('#color-sample1').css('backgroundColor');
//   const color2 = $('#color-sample2').css('backgroundColor');
//   const color3 = $('#color-sample3').css('backgroundColor');
//   const color4 = $('#color-sample4').css('backgroundColor');
//   const color5 = $('#color-sample5').css('backgroundColor');
//   const colorPalette = [color1, color2, color3, color4, color5];
//   return colorPalette.map(rbg => convertToHex(rbg));
// };

// const convertToHex = rgb => {
//   rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
//   function hex(x) {
//     return ('0' + parseInt(x).toString(16)).slice(-2);
//   }
//   return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
// };

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
    ? (lockIcon.src = './images/lock.svg')
    : (lockIcon.src = './images/unlock.svg');
};

loadProjects = async () => {
  const projects = await fetchProjects();
  const palettes = await fetchPalettes();

  displayProjects(projects);
  displayPalettes(palettes);
};

fetchProjects = async () => {
  try {
    const response = await fetch('/api/v1/projects');
    if (!response.ok) {
      throw new Error(`${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Network request failed. (error: ${error.message})`);
  }
};

fetchPalettes = async () => {
  try {
    const response = await fetch('/api/v1/palettes');
    if (!response.ok) {
      throw new Error(`${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Network request failed. (error: ${error.message})`);
  }
};

displayProjects = projects => {
  projects.forEach(project => {
    const { project_name, id } = project;
    appendProject(project_name, id);
  });
};

displayPalettes = palettes => {
  palettes.forEach(palette => {
    $(`.${palette.project_id}`).append(`
    <div class="saved-palette">
      <h4 class="palette-name">${palette.palette_name}</h4>
      <div class="color-thumbnail" style='background-color:${
        palette.color1
      }'></div>
      <div class="color-thumbnail" style='background-color:${
        palette.color2
      }'></div>
      <div class="color-thumbnail" style='background-color:${
        palette.color3
      }'></div>
      <div class="color-thumbnail" style='background-color:${
        palette.color4
      }'></div>
      <div class="color-thumbnail" style='background-color:${
        palette.color5
      }'></div>
      <img class="delete-palette-icon" src="./images/trashcan.svg" alt="trashcan">
    </div>
    `);
  });
};

const appendProject = (name, id) => {
  $('.select-projects').append(`
      <option value=${name}>
        ${name}</option>`);

  $('.saved-projects').append(`
      <div class='project ${id}'>
        <h3 class='project-name'>${name}</h3>    
      </div>`);
};

saveProject = async event => {
  event.preventDefault();
  const $projectName = $('.project-name-input').val();
  const savedProjects = await fetchProjects();
  const projectExists = savedProjects.some(project => {
    return project.project_name === $projectName;
  });

  if (!projectExists && $projectName.length) {
    console.log('%c posted: ', 'background: #000; color: #bada55', 'posted');

    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({ project_name: $projectName }),
        headers: { 'Content-Type': 'application/json' }
      };
      const response = await fetch('/api/v1/projects', options);
      if (!response.ok) {
        throw new Error(`${response.status}`);
      }
      const parsedResponse = await response.json();
      appendProject($projectName, parsedResponse.id);
      $('.project-name-input').val('');
      return parsedResponse;
    } catch (error) {
      throw new Error(`Network request failed. (error: ${error.message})`);
    }
  }
};

$('.lock-icon').click(() => toggleLock(event));
$('.generate-button').click(generatePalette);
$('.save-project').click(saveProject);

$(document).ready(function() {
  loadProjects();
  generatePalette();
  colorizeTitle();
});
