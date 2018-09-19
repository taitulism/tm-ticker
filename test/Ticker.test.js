/* eslint-env mocha */
/* eslint-disable
	global-require,
*/

describe('Ticker:', () => {
	require('./creation');
	require('./API/public-api');
	require('./API/usage');
});
