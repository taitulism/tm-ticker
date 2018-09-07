/* eslint-env mocha */
/* eslint-disable
	func-names,
	max-len,
	max-lines-per-function,
	max-statements,
	no-magic-numbers,
	no-new,
	no-invalid-this,
	no-underscore-dangle,
	prefer-arrow-callback,
*/


const sinon = require('sinon');
const {expect} = require('chai');

const Ticker = require('../src/Ticker');

const noop = () => {}; // eslint-disable-line

describe('Ticker:', () => {
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

	describe('Configuration', function () {
		let spy;

		beforeEach(function () {
			spy = sinon.spy();

			this.clock = sinon.useFakeTimers();
		});

		afterEach(function () {
			this.clock.restore();
		});

		it('sets interval', function () {
			const myTicker = new Ticker();

			myTicker.setInterval(300);

			expect(myTicker.interval).to.equal(300);
		});

		it('sets callback', function () {
			const myTicker = new Ticker();

			myTicker.setCallback(spy);

			expect(myTicker.callback).to.equal(spy);
		});

		it('sets the shouldTickOnStart flag', function () {
			const myTicker = new Ticker(300, spy, true);

			myTicker.setTickOnStart(false);

			myTicker.start();
			expect(spy.callCount).to.equal(0);
			this.clock.tick(300);
			expect(spy.callCount).to.equal(1);
			myTicker.stop();
		});

		it('sets both interval & callback', function () {
			const myTicker = new Ticker();

			myTicker.set(300, spy);

			expect(myTicker.interval).to.equal(300);
			expect(myTicker.callback).to.equal(spy);
		});

		it('can be configured after creation', function () {
			const myTicker = new Ticker();

			myTicker.setInterval(300);
			myTicker.setCallback(spy);

			myTicker.start();
			expect(spy.callCount).to.equal(1);
			this.clock.tick(300);
			expect(spy.callCount).to.equal(2);
			myTicker.stop();
		});
	});

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

	describe('Usage', () => {
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

					this.clock.tick(130);
					expect(spy.callCount).to.equal(1);

					myTicker.stop();
					this.clock.tick(5000);
					myTicker.start();

					this.clock.tick(70);
					expect(spy.callCount).to.equal(2);

					myTicker.stop();
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
				this.clock.tick(60);

				expect(myTicker._timeLeft).to.equal(0);
				myTicker.stop();
				expect(myTicker._timeLeft).to.equal(40);
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
				describe('with start-tick flag', () => {
					it('ticks on call', function () {
						const myTicker = new Ticker(100, spy, true);

						myTicker.start();
						expect(spy.callCount).to.equal(1);

						this.clock.tick(100);
						expect(spy.callCount).to.equal(2);

						myTicker.reset();
						expect(spy.callCount).to.equal(3);
					});
				});

				describe('without start-tick flag', () => {
					it('doesn\'t tick on call', function () {
						const myTicker = new Ticker(100, spy, false);

						myTicker.start();
						expect(spy.callCount).to.equal(0);

						this.clock.tick(100);
						expect(spy.callCount).to.equal(1);

						myTicker.reset();
						expect(spy.callCount).to.equal(1);
					});
				});

				it('does not stop ticking', function () {
					const myTicker = new Ticker(100, spy, false);

					myTicker.start();

					this.clock.tick(100);
					expect(spy.callCount).to.equal(1);

					myTicker.reset();
					expect(spy.callCount).to.equal(1);

					this.clock.tick(100);
					expect(spy.callCount).to.equal(2);

					this.clock.tick(100);
					expect(spy.callCount).to.equal(3);

					myTicker.stop();
				});

				it('sets a new starting point to calc the interval from', function () {
					const myTicker = new Ticker(100, spy);

					myTicker.start();
					expect(spy.callCount).to.equal(1);

					this.clock.tick(250);
					expect(spy.callCount).to.equal(3);

					myTicker.reset();
					expect(spy.callCount).to.equal(4);

					// Make sure not using `.timeLeft`
					this.clock.tick(70);
					expect(spy.callCount).to.equal(4);

					this.clock.tick(30);
					expect(spy.callCount).to.equal(5);

					myTicker.stop();
				});
			});

			describe('when called after .stop()', () => {
				it('resets to zero the remaining ms to next tick', function () {
					const myTicker = new Ticker(100, spy, false);

					myTicker.start();

					this.clock.tick(90);

					myTicker.stop();
					expect(myTicker.timeLeft).to.equal(10);

					myTicker.reset();
					expect(myTicker.timeLeft).to.equal(0);

					myTicker.start();
					expect(myTicker.timeLeft).to.equal(100);

					this.clock.tick(60);

					expect(myTicker.timeLeft).to.equal(40);

					myTicker.stop();
				});
			});
		});

		describe('.destroy()', () => {
			let spy;

			beforeEach(function () {
				spy = sinon.spy();

				this.clock = sinon.useFakeTimers();
			});

			afterEach(function () {
				this.clock.restore();
			});

			it('kills the ticker', function () {
				const myTicker = new Ticker(100, spy, false)

				myTicker.start();
				this.clock.tick(300);
				expect(spy.callCount).to.equal(3);

				myTicker.destroy();

				myTicker.start();
				this.clock.tick(300);
				expect(spy.callCount).to.equal(3);
			});

			it('can be revived given a new callback', function () {
				const myTicker = new Ticker(100, spy, false)

				myTicker.start()
				this.clock.tick(300);
				expect(spy.callCount).to.equal(3);

				myTicker.destroy()

				myTicker.setCallback(spy);
				myTicker.start();
				this.clock.tick(300);
				expect(spy.callCount).to.equal(6);
			});
		});
	});
});
