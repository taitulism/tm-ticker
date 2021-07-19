import creation from './creation';
import instancePublicMembers from './instance-public-members';
import usage from './API/usage';

describe('Ticker', () => {
	instancePublicMembers();
	creation();
	usage();
});
