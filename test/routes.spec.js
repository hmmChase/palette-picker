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

  it('returns 404 for a route that does not exist', done => {
    chai
      .request(server)
      .get('/sad')
      .end((error, response) => {
        response.should.have.status(404);
      });
    done();
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
          console.log('is this doing anything?');

          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(1);
        });
      done();
    });
  });

  describe('POST /api/v1/projects', () => {});

  describe('GET /api/v1/palettes', () => {});

  describe('POST /api/v1/palettes', () => {});

  describe('DELETE /api/v1/palettes', () => {});
});
