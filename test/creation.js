/* eslint-env mocha */
/* eslint-disable
	max-lines-per-function,
	no-magic-numbers,
	no-new,
	no-unused-expressions,
*/

const {expect} = require('chai');

const {
	Ticker,
	noop,
} = require('./common');

describe('Create', () => {
	describe('Empty', () => {
		it('is created without errors', () => {
			function wrapper () {
				return new Ticker();
			}

			expect(wrapper).to.not.throw(Error);
		});
	});

	describe('with interval', () => {
		it('is created without errors', () => {
			const myTicker = new Ticker(300);

			expect(myTicker.interval).to.equal(300);
		});
	});

	describe('with callback', () => {
		it('is created without errors', () => {
			const myTicker = new Ticker(null, noop);

			expect(myTicker.callback).to.equal(noop);
		});
	});

	describe('when constructed with valid interval and callback', () => {
		it('returns an instance of Ticker', () => {
			const myTicker = new Ticker(1000, noop);

			expect(myTicker instanceof Ticker).to.be.true;
		});
	});

	describe('with an invalid interval or callback', () => {
		it('throws an error on invalid interval', () => {
			function wrapper () {
				new Ticker('not a number', noop);
			}

			expect(wrapper).to.throw(Error);
		});

		it('throws an error on invalid callback', () => {
			function wrapper () {
				new Ticker(1000, 'not a function');
			}

			expect(wrapper).to.throw(Error);
		});
	});
});
