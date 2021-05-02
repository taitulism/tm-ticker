export default function usage () {
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
