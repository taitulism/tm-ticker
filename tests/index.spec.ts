import stow from 'set-timeout-worker';

import creation from './creation';
import publicAPI from './public-API';
import usage from './API/usage';

describe('Ticker', () => {
	afterEach(() => {
		stow.stop();
	});

	creation();
	publicAPI();
	usage();
});
