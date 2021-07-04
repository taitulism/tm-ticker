import {expect} from 'chai';
import { Ticker } from './common';

export default function instancePublicMembers (): void {
	describe('Instance Public Members', () => {
		const ticker = new Ticker();

		it('.isTicking', () => {
			expect(ticker.isTicking).to.be.a('boolean');
		});

		it('.timeToNextTick', () => {
			expect(ticker.timeToNextTick).to.be.a('number');
		});

		it('.setInterval()', () => {
			expect(ticker.setInterval).to.be.a('function');
		});

		it('.onTick()', () => {
			expect(ticker.onTick).to.be.a('function');
		});

		it('.start()', () => {
			expect(ticker.start).to.be.a('function');
		});

		it('.stop()', () => {
			expect(ticker.stop).to.be.a('function');
		});

		it('.reset()', () => {
			expect(ticker.reset).to.be.a('function');
		});
	});
}
