import configuration from './configuration';
import start from './start';
import timeToNextTick from './timeToNextTick';
import stop from './stop';
import reset from './reset';
import destroy from './destroy';

export default function usage () {
	describe('Usage', () => {
		configuration();

		describe('Using', () => {
			start();
			timeToNextTick();
			stop();
			reset();
			destroy();
		});
	});
};
