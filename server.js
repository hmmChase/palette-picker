const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(express.static('public'));

app.set('port', process.env.PORT || 3000);

app.get('/', (request, response) => {
  response.status(200).text('this does nothing');
});

app.get('/api/v1/palettes', (request, response) => {
  database('palettes')
    .select()
    .then(palettes => {
      response.status(200).json(palettes);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/projects', (request, response) => {
  database('projects')
    .select()
    .then(projects => {
      response.status(200).json(projects);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;

  if (!project.project_name) {
    return response.status(422).send({ Error: 'Missing project name' });
  }
  database('projects')
    .insert(project, 'id')
    .then(projectID => {
      response.status(201).json({ id: projectID[0] });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/palettes', (request, response) => {
  const palette = request.body;

  if (!palette.palette_name) {
    return response.status(422).send({ Error: 'Missing palette name' });
  }
  database('palettes')
    .insert(palette, 'id')
    .then(paletteID => {
      response.status(201).json({ id: paletteID[0] });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.delete('/api/v1/palettes', (request, response) => {
  const { id } = request.body;
  database('palettes')
    .where('id', id)
    .del()
    .then(() => {
      response.sendStatus(204);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.listen(app.get('port'), () => {
  console.log(`server is running on localhost:${app.get('port')}`);
});

module.exports = app;

// test comment