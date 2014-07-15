/* global describe, it, expect, before */
/* jshint expr: true */

var fs = require('fs')
  , PixivStrategy = require('../lib/strategy');


describe('Strategy#userProfile', function() {

  var strategy =  new PixivStrategy({
      clientID: 'ABC123',
      clientSecret: 'secret'
    },
    function() {});

  // mock
  strategy._oauth2.get = function(url, accessToken, callback) {
    if (url != 'https://public-api.secure.pixiv.net/v1/me.json') { return callback(new Error('wrong url argument')); }
    if (accessToken != 'token') { return callback(new Error('wrong token argument')); }

    fs.readFile('test/data/example.json', 'utf8', function(err, body) {
      if (err) { return callback(err); }
      callback(null, body, undefined);
    });
  };

  describe('loading profile', function() {
    var profile;

    before(function(done) {
      strategy.userProfile('token', function(err, p) {
        if (err) { return done(err); }
        profile = p;
        done();
      });
    });

    it('should parse profile', function() {
      expect(profile.provider).to.equal('pixiv');

      expect(profile.id).to.equal('11');
      expect(profile.username).to.equal('pixiv');
      expect(profile.displayName).to.equal('pixiv事務局');
      expect(profile.photos).to.have.length(2);
    });

    it('should set raw property', function() {
      expect(profile._raw).to.be.a('string');
    });

    it('should set json property', function() {
      expect(profile._json).to.be.an('object');
    });
  });

  describe('encountering an error', function() {
    var err, profile;

    before(function(done) {
      strategy.userProfile('wrong-token', function(e, p) {
        err = e;
        profile = p;
        done();
      });
    });

    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.constructor.name).to.equal('InternalOAuthError');
      expect(err.message).to.equal('Failed to fetch user profile');
    });

    it('should not load profile', function() {
      expect(profile).to.be.undefined;
    });
  });

});
