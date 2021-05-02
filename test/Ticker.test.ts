const creation = require('./creation');
const publicAPI = require('./public-API');
const usage = require('./API/usage');

describe('Ticker', () => {
	creation();
	publicAPI();
	usage();
});
