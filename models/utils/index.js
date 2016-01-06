/**
 * Localize field in object
 *
 * @param {Object} object -
 * @param {String} key - target hash key in supplied object, which contains set of localized values:
 *                       { "locale0": <value>, "locale1": <value>, ... "localeN": <value> }
 * @param {String} locale
 *
 * @returns {Object}
 */
exports.localizeField = function( object, key, locale ){
  var result = Object.assign( {}, object );
  var field  = result[key];

  if ( ! field || typeof field !== 'object' ){
    return Object.assign( {}, object );
  }

  return Object.assign( {}, object, {
    [key]: field[locale] || ""
  });
};



/**
 * Copy object and swap key "_id" with "id"
 *
 * @param {Object} object
 * @returns {Object}
 */
exports.normalizeId = function( object ){
  var result = Object.assign( {}, object, { id: object._id } );

  delete result._id;

  return result;
};


/**
 * Copy object and remove all ID-related properties
 *
 * @param object
 * @returns {Object}
 */
exports.withoutId = function( object ){
  var result = Object.assign( {}, object );

  delete result.id;
  delete result._id;

  return result;
};



/**
 * Randomize elements order of supplied array
 *
 * @param {Array} array
 * @returns {Array}
 */
exports.shuffleList = function( array ){
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};
