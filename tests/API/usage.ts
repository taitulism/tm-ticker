import configuration from './configuration';
import start from './start';
import getTimeLeft from './getTimeLeft';
import stop from './stop';
import reset from './reset';
import destroy from './destroy';

export default function usage () {
	describe('Usage', () => {
		configuration();

		describe('Using', () => {
			start();
			getTimeLeft();
			stop();
			reset();
			destroy();
		});
	});
};
