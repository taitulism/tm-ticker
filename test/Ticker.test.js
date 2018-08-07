const expect = require('chai').expect;
const sinon  = require('sinon');

const Ticker = require('../src/Ticker');

const noop = () => {};

describe('Ticker', () => {
	describe('Class', () => {
		it('is a class', () => {
			expect(Ticker).to.be.a('function');
		});

		describe('construction', () => {
			describe('when constructed properly', () => {
				it('returns an instance of Ticker', () => {
					const myTicker = new Ticker(1000, () => {});

					expect(myTicker instanceof Ticker).to.be.true;
				});
			});

			describe('with an invalid interval', () => {
				it('throws an error', () => {
					const myTicker = new Ticker('not a number', () => {});
				});
			});
	
			describe('with an invalid callback', () => {
				it('throws an error', () => {
					function wrapper () {
						const myTicker = new Ticker(1000, 'not a function');
					}

					expect(wrapper).to.throw(Error);
				});
			});
		});
	});
	
	describe('Instance', () => {
		let myTicker;

		beforeEach (() => {
			myTicker = new Ticker(1000, noop);
		}); 
		
		afterEach (() => {
			myTicker = null;
		});

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

	describe('.start()', function () {
		let spy;

		beforeEach(function () {
			spy = sinon.spy();

			this.clock = sinon.useFakeTimers();
		});

		afterEach(function () {
			this.clock.restore();
		});

		describe('when constructed without a flag', () => {
			it('makes Ticker call the callback on start', function () {
				const myTicker = new Ticker(100, spy, true);
				expect(spy.callCount).to.equal(0);
	
				myTicker.start();
				expect(spy.callCount).to.equal(1);
	
				this.clock.tick(97);
				expect(spy.callCount).to.equal(1);
	
				this.clock.tick(3);
				expect(spy.callCount).to.equal(2);
			});
		});

		it('makes Ticker call the callback on start', function () {
			const myTicker = new Ticker(100, spy, true);
			expect(spy.callCount).to.equal(0);

			myTicker.start();
			expect(spy.callCount).to.equal(1);

			this.clock.tick(97);
			expect(spy.callCount).to.equal(1);

			this.clock.tick(3);
			expect(spy.callCount).to.equal(2);
		});

		it('makes Ticker call the callback on first tick', function () {
			const myTicker = new Ticker(100, spy, false);
			expect(spy.callCount).to.equal(0);

			myTicker.start();
			expect(spy.callCount).to.equal(0);

			this.clock.tick(97);
			expect(spy.callCount).to.equal(0);

			this.clock.tick(3);
			expect(spy.callCount).to.equal(1);
		});
	});
});
