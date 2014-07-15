/* global describe, it, expect, before */
/* jshint expr: true */

var fs = require('fs')
  , parse = require('../lib/profile').parse;


describe('profile.parse', function() {

  describe('example profile', function() {
    var profile;

    before(function(done) {
      fs.readFile('test/data/example.json', 'utf8', function(err, data) {
        if (err) { return done(err); }
        profile = parse(data);
        done();
      });
    });

    it('should parse profile', function() {
      expect(profile.id).to.equal('11');
      expect(profile.username).to.equal('pixiv');
      expect(profile.displayName).to.equal('pixiv事務局');
      expect(profile.photos).to.have.length(2);
    });
  });

});
