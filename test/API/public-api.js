const {expect} = require('chai');

const {
	Ticker,
	noop,
} = require('../common');

describe('API', () => {
	const myTicker = new Ticker(1000, noop);

	describe('Props', () => {
		it('has a .isRunning flag prop', () => {
			expect(myTicker.isRunning).to.be.a('boolean');
		});
		it('has a .timeLeft prop', () => {
			expect(myTicker.timeLeft).to.be.a('number');
		});
		it('has a .isPaused getter prop', () => {
			expect(myTicker.isPaused).to.be.a('boolean');
		});
		it('has a .timeLeft getter prop', () => {
			expect(myTicker.timeLeft).to.be.a('number');
		});
		it('has a .shouldTickOnStart prop', () => {
			expect(myTicker.shouldTickOnStart).to.be.a('boolean');
		});
	});

	describe('Configuration', () => {
		it('has a .setInterval(num) method', () => {
			expect(myTicker.setInterval).to.be.a('function');
		});
		it('has a .setCallback(fn) method', () => {
			expect(myTicker.setCallback).to.be.a('function');
		});
		it('has a .setTickOnStart(bool) method', () => {
			expect(myTicker.setTickOnStart).to.be.a('function');
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
	});
});
