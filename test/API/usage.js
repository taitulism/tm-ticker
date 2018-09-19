/* eslint-env mocha */
/* eslint-disable
	global-require,
*/

describe('Usage', () => {
	describe('usage', () => {
		require('./configuration');
		require('./start');
		require('./stop');
		require('./reset');
		require('./destroy');
	});
});
