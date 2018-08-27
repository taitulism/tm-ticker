const expect = require('chai').expect;
const sinon  = require('sinon');

const Ticker = require('../src/Ticker');

const noop = () => {};

describe('Ticker', () => {
	describe('Construction', () => {
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
	
	describe('API', () => {
		let myTicker = new Ticker(1000, noop);

		describe('Props', () => {
			it('has a .isRunning flag prop', () => {
				expect(myTicker.isRunning).to.be.a('boolean');
			});
			it('has a .remainToNextTick prop', () => {
				expect(myTicker.remainToNextTick).to.be.a('number');
			});
			it('has a .isPaused getter prop', () => {
				expect(myTicker.isPaused).to.be.a('boolean');
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

	describe('.start()', function () {
		let spy;

		beforeEach(function () {
			spy = sinon.spy();

			this.clock = sinon.useFakeTimers();
		});

		afterEach(function () {
			this.clock.restore();
		});

		it('starts ticking and calls the callback on every tick', function () {
			const myTicker = new Ticker(100, spy, false);
			expect(spy.callCount).to.equal(0);

			myTicker.start();
			expect(spy.callCount).to.equal(0);

			this.clock.tick(300);
			expect(spy.callCount).to.equal(3);

			myTicker.stop();
		});
		
		describe('when constructed with a false flag', () => {
			it('calls the callback on first tick', function () {
				const myTicker = new Ticker(100, spy, false);
				expect(spy.callCount).to.equal(0);
	
				myTicker.start();
				expect(spy.callCount).to.equal(0);
	
				this.clock.tick(97);
				expect(spy.callCount).to.equal(0);
	
				this.clock.tick(3);
				expect(spy.callCount).to.equal(1);

				myTicker.stop();
			});
		});

		describe('when constructed without a flag', () => {
			it('calls the callback on start', function () {
				const myTicker = new Ticker(100, spy);
				expect(spy.callCount).to.equal(0);
	
				myTicker.start();
				expect(spy.callCount).to.equal(1);
	
				this.clock.tick(97);
				expect(spy.callCount).to.equal(1);
	
				this.clock.tick(3);
				expect(spy.callCount).to.equal(2);

				myTicker.stop();
			});
		});

		describe('when called after .stop()', function () {
			it('resumes from the stopping point', function () {
				const myTicker = new Ticker(100, spy, false);
			
				myTicker.start();
				expect(spy.callCount).to.equal(0);
				this.clock.tick(290);
				myTicker.stop();
				expect(spy.callCount).to.equal(2);
				
				this.clock.tick(5000);
				
				myTicker.start();
				expect(spy.callCount).to.equal(2);
				this.clock.tick(10);
				expect(spy.callCount).to.equal(3);
			});
		});
	});

	describe('.stop()', function () {
		let spy;

		beforeEach(function () {
			spy = sinon.spy();

			this.clock = sinon.useFakeTimers();
		});

		afterEach(function () {
			this.clock.restore();
		});

		it('stops ticking', function () {
			const myTicker = new Ticker(100, spy);
			expect(spy.callCount).to.equal(0);

			myTicker.start();
			expect(spy.callCount).to.equal(1);
			myTicker.stop();

			this.clock.tick(300);
			expect(spy.callCount).to.equal(1);
		});

		it('saves the remaining ms to next tick', function () {
			const myTicker = new Ticker(100, spy);
			
			myTicker.start();
			this.clock.tick(90);
			
			expect(myTicker.remainToNextTick).to.equal(0);
			myTicker.stop();
			expect(myTicker.remainToNextTick).to.equal(10);
		});
	});

	describe('.reset()', () => {
		let spy;

		beforeEach(function () {
			spy = sinon.spy();

			this.clock = sinon.useFakeTimers();
		});

		afterEach(function () {
			this.clock.restore();
		});

		describe('when called while running', () => {
			it('does not stop ticking', function () {
				const myTicker = new Ticker(100, spy, false);
				
				myTicker.start();
				
				this.clock.tick(250);
				expect(spy.callCount).to.equal(2);
				
				myTicker.reset();
				expect(spy.callCount).to.equal(2);

				this.clock.tick(100);
				expect(spy.callCount).to.equal(3);

				myTicker.stop();
			});

			it('sets a new starting point to calc the interval from', function () {
				const myTicker = new Ticker(100, spy);
				
				myTicker.start();
				
				this.clock.tick(250);
				expect(spy.callCount).to.equal(3);
				
				myTicker.reset();
				expect(spy.callCount).to.equal(4);

				// make sure not using .remainToNextTick
				this.clock.tick(70);
				expect(spy.callCount).to.equal(4);
				
				this.clock.tick(30);
				expect(spy.callCount).to.equal(5);

				myTicker.stop();
			});
		});

		describe('when called after .stop()', () => {
			it('saves the remaining ms to next tick', function () {
				const myTicker = new Ticker(100, spy, false);
				
				myTicker.start();
				this.clock.tick(290);
				expect(spy.callCount).to.equal(2);
				
				myTicker.stop();
				myTicker.reset();
				
				this.clock.tick(10);
				expect(myTicker.remainToNextTick).to.equal(0);
			});
		});
	});
});
