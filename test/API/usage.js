/* eslint-env mocha */
/* eslint-disable
	global-require,
*/

module.exports = function usage () {
	describe('Usage', () => {
		require('./configuration');
		describe('Using', () => {
			require('./start');
			require('./getTimeLeft');
			require('./stop');
			require('./reset');
			require('./destroy');
		});
	});
};
