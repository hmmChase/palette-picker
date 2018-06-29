process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../server');
const configuration = require('../knexfile')['test'];
const knex = require('knex')(configuration);

chai.use(chaiHttp);

describe('CLIENT routes', () => {
  it('receives root endpoint response of HTML', done => {
    chai
      .request(server)
      .get('/')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.html;
        done();
      });
  });

  it('returns status 404 for a route that does not exist', done => {
    chai
      .request(server)
      .get('/sad')
      .end((error, response) => {
        response.should.have.status(404);
        done();
      });
  });
});

describe('API routes', () => {
  beforeEach(done => {
    knex.migrate.rollback().then(() => {
      knex.migrate.latest().then(() => {
        return knex.seed.run().then(() => {
          done();
        });
      });
    });
  });

  describe('GET /api/v1/projects', () => {
    it('returns an array of all projects', done => {
      chai
        .request(server)
        .get('/api/v1/projects')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('project_name');
          response.body[0].project_name.should.equal('Seed project');
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(1);
          done();
        });
    });
  });

  describe('POST /api/v1/projects', () => {
    it('adds a project to the database', done => {
      chai
        .request(server)
        .post('/api/v1/projects')
        .send({
          project_name: 'Mock project'
        })
        .end((err, response) => {
          response.should.have.status(201);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('id');
          response.body.id.should.equal(2);
          done();
        });
    });

    it('returns status 422 if name is missing', done => {
      chai
        .request(server)
        .post('/api/v1/projects')
        .send({})
        .end((error, response) => {
          response.should.have.status(422);
          done();
        });
    });
  });

  describe('GET /api/v1/palettes', () => {
    it('returns an array of all palettes', done => {
      chai
        .request(server)
        .get('/api/v1/palettes')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(2);
          response.body[0].should.have.property('palette_name');
          response.body[0].palette_name.should.equal('Seed palette 1');
          response.body[0].should.have.property('color1');
          response.body[0].color1.should.equal('#874D94');
          response.body[0].should.have.property('color1');
          response.body[0].color2.should.equal('#013A9B');
          response.body[0].should.have.property('color1');
          response.body[0].color3.should.equal('#BE52F9');
          response.body[0].should.have.property('color1');
          response.body[0].color4.should.equal('#4B69ED');
          response.body[0].should.have.property('color1');
          response.body[0].color5.should.equal('#87E9CD');
          response.body[0].should.have.property('project_id');
          response.body[0].project_id.should.equal(1);
          done();
        });
    });
  });

  describe('POST /api/v1/palettes', () => {
    it('adds a palette to the database', done => {
      chai
        .request(server)
        .post('/api/v1/palettes')
        .send({
          palette_name: 'Mock palette',
          color1: '#874D94,',
          color2: '#013A9B,',
          color3: '#874D94,',
          color4: '#4B69ED,',
          color5: '#87E9CD,',
          project_id: 1
        })
        .end((err, response) => {
          response.should.have.status(201);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('id');
          response.body.id.should.equal(3);
          done();
        });
    });

    it('returns status 422 if name is missing', done => {
      chai
        .request(server)
        .post('/api/v1/palettes')
        .send({})
        .end((error, response) => {
          response.should.have.status(422);
          done();
        });
    });
  });

  describe('DELETE /api/v1/palettes', () => {
    it('deletes a palette from the database', done => {
      chai
        .request(server)
        .delete('/api/v1/palettes')
        .send({ id: 1 })
        .end((err, response) => {
          response.should.have.status(204);
          done();
        });
    });
  });
});
