/* eslint-env mocha */
/* eslint-disable
	max-lines-per-function,
	no-magic-numbers,
	func-names,
	prefer-arrow-callback,
*/

const sinon = require('sinon');
const {expect} = require('chai');

const {Ticker} = require('../common');

describe('Configuration', function () {
	let spy, clock;

	beforeEach(function () {
		spy = sinon.spy();

		clock = sinon.useFakeTimers();
	});

	afterEach(function () {
		clock.restore();
	});

	describe('.setInterval()', () => {
		it('sets interval prop', function () {
			const myTicker = new Ticker();

			myTicker.setInterval(300);

			expect(myTicker.interval).to.equal(300);
		});
	});

	describe('.setCallback()', () => {
		it('sets callback prop', function () {
			const myTicker = new Ticker();

			myTicker.setCallback(spy);

			expect(myTicker.callback).to.equal(spy);
		});
	});

	describe('.tickOnStart = bool', () => {
		it('sets the tickOnStart flag', function () {
			const myTicker = new Ticker(300, spy, true);

			myTicker.tickOnStart = false;

			myTicker.start();
			expect(spy.callCount).to.equal(0);
			clock.tick(300);
			expect(spy.callCount).to.equal(1);
			myTicker.destroy();
		});
	});


	describe('.set()', () => {
		it('sets both interval & callback', function () {
			const myTicker = new Ticker();

			myTicker.set(300, spy);

			expect(myTicker.interval).to.equal(300);
			expect(myTicker.callback).to.equal(spy);
		});
	});
});
