import {expect} from 'chai';
import { Ticker, noop } from './common';

export default function publicAPI (): void {
	describe('Instance', () => {
		let ticker: Ticker;

		before(() => { ticker = new Ticker(100, noop); });
		after(() => { ticker.destroy(); });

		describe('Props', () => {
			it('isTicking: boolean', () => {
				expect(ticker.isTicking).to.be.a('boolean');
			});
			it('tickOnStart: boolean', () => {
				expect(ticker.tickOnStart).to.be.a('boolean');
			});
			it('timeToNextTick: number (getter)', () => {
				expect(ticker.timeToNextTick).to.be.a('number');
			});
		});

		describe('Setup Methods', () => {
			it('.set(num, fn)', () => {
				expect(ticker.set).to.be.a('function');
			});
			it('.setInterval(num)', () => {
				expect(ticker.setInterval).to.be.a('function');
			});
			it('.onTick(fn)', () => {
				expect(ticker.onTick).to.be.a('function');
			});
		});

		describe('Methods', () => {
			it('.start()', () => {
				expect(ticker.start).to.be.a('function');
			});
			it('.stop()', () => {
				expect(ticker.stop).to.be.a('function');
			});
			it('.reset()', () => {
				expect(ticker.reset).to.be.a('function');
			});
			it('.destroy()', () => {
				expect(ticker.destroy).to.be.a('function');
			});
		});
	});
}
