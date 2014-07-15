/**
 * Parse profile.
 *
 * @param {Object|String} json
 * @return {Object}
 * @api private
 */
exports.parse = function(json) {
  if ('string' == typeof json) {
    json = JSON.parse(json).response[0];
  } else {
    json = json.response[0];
  }

  var profile = {};
  profile.id = String(json.id);
  profile.displayName = json.name;
  profile.username = json.account;
  profile.photos = [];
  for (var photo in json.profile_image_urls) {
    profile.photos.push({
      type: photo,
      value: json.profile_image_urls[photo]
    });
  }
  return profile;
};
