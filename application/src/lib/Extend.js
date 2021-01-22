/*
 * Extend.js
 *  Merges two JavaScript objects.
 *  Performs deep merge if first argument is 'true'
 * 
 *  Why? Because immutable.js concatenates nested Lists, which messes up Redux+Normalizr entity relationships.
 *
 *  Ref: https://gomakethings.com/merging-objects-with-vanilla-javascript/
 *  Issue: https://github.com/immutable-js/immutable-js/issues/1452
 */

const extend = function() {

	// Variables
	var extended = {};
	var deep = false;
	var i = 0;

	// Check if a deep merge
	if (typeof (arguments[0]) === 'boolean') {
		deep = arguments[0];
		i++;
	}

	// Merge the object into the extended object
	var merge = function (obj) {
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
					// If we're doing a deep merge and the property is an object
					extended[prop] = extend(true, extended[prop], obj[prop]);
				} else {
					// Otherwise, do a regular merge
					extended[prop] = obj[prop];
				}
			}
		}
	};

	// Loop through each object and conduct a merge
	for (; i < arguments.length; i++) {
		merge(arguments[i]);
	}

	return extended;
};

export default extend;
