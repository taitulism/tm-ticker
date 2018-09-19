/* eslint-env mocha */
/* eslint-disable
	func-names,
	max-len,
	max-lines-per-function,
	max-statements,
	no-magic-numbers,
	no-new,
	no-invalid-this,
	no-underscore-dangle,
	prefer-arrow-callback,
*/

describe('Ticker:', () => {
	require('./creation');
	require('./API/public-api');
	require('./API/usage');
});
