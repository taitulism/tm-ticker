import {expect} from 'chai';
import { Ticker, noop } from './common';

export default function publicAPI () {
	describe('Public API', () => {
		let myTicker: Ticker;

		before(() => {
			myTicker = new Ticker(1000, noop);
		});

		after(() => {
			myTicker.destroy();
		});

		describe('Props', () => {
			it('has a .isTicking flag prop', () => {
				expect(myTicker.isTicking).to.be.a('boolean');
			});
			it('has a .tickOnStart prop', () => {
				expect(myTicker.tickOnStart).to.be.a('boolean');
			});
			it('has a .timeLeft prop', () => {
				expect(myTicker.remainder).to.be.a('number');
			});
			it('has a .timeToNextTick prop', () => {
				expect(myTicker.timeToNextTick).to.be.a('number');
			});
		});

		describe('Configuration Methods', () => {
			it('has a .setInterval(num) method', () => {
				expect(myTicker.setInterval).to.be.a('function');
			});
			it('has a .setCallback(fn) method', () => {
				expect(myTicker.setCallback).to.be.a('function');
			});
			it('has a .set(num, fn) method', () => {
				expect(myTicker.set).to.be.a('function');
			});
		});

		describe('Methods', () => {
			it('has a .start() method', () => {
				expect(myTicker.start).to.be.a('function');
			});
			it('has a .stop() method', () => {
				expect(myTicker.stop).to.be.a('function');
			});
			it('has a .reset() method', () => {
				expect(myTicker.reset).to.be.a('function');
			});
			it('has a .destroy() method', () => {
				expect(myTicker.destroy).to.be.a('function');
			});
		});
	});
};
