const randomHexColor = () => {
  return '#000000'.replace(/0/g, () => (~~(Math.random() * 16)).toString(16));
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
          .text(color.toUpperCase());
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

const toggleLock = () => {
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
    const colors = [
      palette.color1,
      palette.color2,
      palette.color3,
      palette.color4,
      palette.color5
    ];
    appendPalette(palette.palette_name, palette.id, colors, palette.project_id);
  });
};

const pickPalette = () => {
  const children = event.path[1].children;
  const colorArray = Array.from(children).filter(element => {
    return element.className === 'color-thumbnail';
  });
  const hexColorArray = colorArray.map(color => {
    return convertToHex(color.style.backgroundColor);
  });
  $('#color-sample1').css('background-color', hexColorArray[0]);
  $('#color-sample2').css('background-color', hexColorArray[1]);
  $('#color-sample3').css('background-color', hexColorArray[2]);
  $('#color-sample4').css('background-color', hexColorArray[3]);
  $('#color-sample5').css('background-color', hexColorArray[4]);
};

const appendProject = (name, id) => {
  $('.select-projects').append(`
      <option value=${id}>
        ${name}</option>`);

  $('.saved-projects').append(`
      <div class='project' id=project${id}>
        <h3 class='project-name'>${name}</h3>    
      </div>`);
};

const appendPalette = (paletteName, paletteID, colors, projectId) => {
  $(`#project${projectId}`).append(`
  <div class="saved-palette" id=${paletteID}>
    <h4 class="palette-name">${paletteName}</h4>
    <div class="color-thumbnail" style='background-color:${colors[0]}'></div>
    <div class="color-thumbnail" style='background-color:${colors[1]}'></div>
    <div class="color-thumbnail" style='background-color:${colors[2]}'></div>
    <div class="color-thumbnail" style='background-color:${colors[3]}'></div>
    <div class="color-thumbnail" style='background-color:${colors[4]}'></div>
    <img class="delete-palette-icon" src="./images/trashcan.svg" alt="trashcan">
  </div>
  `);
};

saveProject = async event => {
  event.preventDefault();
  const $projectName = $('.project-name-input').val();
  const savedProjects = await fetchProjects();
  const projectExists = savedProjects.some(project => {
    return project.project_name === $projectName;
  });

  if (!projectExists && $projectName.length) {
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
  alert("Please provide a name that hasn't been used");
};

const savePalette = async event => {
  event.preventDefault();
  const $paletteName = $('.palette-name-input').val();
  const $projectID = $('.select-projects option:selected').val();
  const colors = getPaletteColors();
  const savedPalettes = await fetchPalettes();

  const paletteExists = savedPalettes.some(palette => {
    return palette.palette_name === $paletteName;
  });

  if (!paletteExists && $paletteName.length) {
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          palette_name: $paletteName,
          color1: colors[0],
          color2: colors[1],
          color3: colors[2],
          color4: colors[3],
          color5: colors[4],
          project_id: $projectID
        }),
        headers: { 'Content-Type': 'application/json' }
      };
      const response = await fetch('/api/v1/palettes', options);
      if (!response.ok) {
        throw new Error(`${response.status}`);
      }
      const parsedResponse = await response.json();
      appendPalette($paletteName, parsedResponse.id, colors, $projectID);
      $('.palette-name-input').val('');
      return parsedResponse;
    } catch (error) {
      throw new Error(`Network request failed. (error: ${error.message})`);
    }
  }
  alert("Please provide a name that hasn't been used");
};

const deletePalette = async () => {
  const palette = event.path[1];
  try {
    const options = {
      method: 'DELETE',
      body: JSON.stringify({ id: palette.id }),
      headers: { 'Content-Type': 'application/json' }
    };
    const response = await fetch('/api/v1/palettes', options);
    if (!response.ok) {
      throw new Error(`${response.status}`);
    }
    palette.remove();
  } catch (error) {
    throw new Error(`Network request failed. (error: ${error.message})`);
  }
};

$('.lock-icon').click(toggleLock);
$('.generate-button').click(generatePalette);
$('.save-project').click(saveProject);
$('.save-palette').click(savePalette);
$('.saved-projects').on('click', '.delete-palette-icon', deletePalette);
$('.saved-projects').on('click', '.color-thumbnail', pickPalette);

$(document).ready(function() {
  loadProjects();
  generatePalette();
  colorizeTitle();
});
