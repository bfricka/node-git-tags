var _ = require('lodash');
var chai = require('chai');
var expect = chai.expect;
var semver = require('semver');
var gittags = require('../index');

describe('Node Git Tags:', function() {
  it('should properly get semver tags', function(done) {
    gittags.get(function(err, tags) {
      expect(tags).to.be.array;
      expect(tags).to.include('v0.2.0');
      done();
    });
  });

  it('should handle relative paths', function(done) {
    gittags.get('./', function(err, tags) {
      expect(tags).to.be.array;
      done();
    });
  });

  it('should handle errors properly', function(done) {
    gittags.get('/', function(err, tags) {
      expect(err).to.be.string;
      expect(tags).to.not.be.defined;
      done();
    });
  });

  describe('Helpers', function() {
    var tags;

    beforeEach(function(done) {
      gittags.get(function(err, t) {
        tags = t;
        done();
      });
    });

    describe('latest', function() {
      it('should get the latest tags', function(done) {
        gittags.latest(function(err, latest) {
          expect(latest).to.equal(_.first(tags));
          done();
        });
      });

      it('should properly handle errors', function(done) {
        gittags.latest('/', function(err, latest) {
          expect(err).to.be.string;
          expect(latest).to.not.be.defined;
          done();
        });
      });
    });

    describe('oldest', function() {
      it('should get the oldest tags', function(done) {
        gittags.oldest(function(err, oldest) {
          expect(oldest).to.equal(_.last(tags));
          done();
        });
      });

      it('should properly handle errors', function(done) {
        gittags.oldest('/', function(err, oldest) {
          expect(err).to.be.string;
          expect(oldest).to.not.be.defined;
          done();
        });
      });
    });

    describe('parse', function() {
      it('should parse tags using semver', function() {
        expect(gittags.parse(tags[0])).to.be.instanceof(semver);
      });
    });

    describe('mmp', function() {
      it('should return "major"."minor"."patch" formatted tag', function() {
        expect(gittags.mmp(_.last(tags))).to.equal('0.1.0');
      });
    });
  });
});
