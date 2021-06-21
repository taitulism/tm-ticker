import sinon from 'sinon';
import {expect} from 'chai';
import { Ticker, noop } from './common';

export default function instanceCreation (): void {
	describe('Constructor', () => {
		describe('with no arguments', () => {
			it('is ok', () => {
				function wrapper () {
					return new Ticker();
				}

				expect(wrapper).to.not.throw(Error);
			});

			it('returns a `Ticker` instance', () => {
				const ticker = new Ticker();

				expect(ticker instanceof Ticker).to.be.true;
			});
		});

		describe('with `interval` argument', () => {
			it('returns a `Ticker` instance', () => {
				const ticker = new Ticker(100);

				expect(ticker instanceof Ticker).to.be.true;
			});

			it('if valid - sets the `interval` value', () => {
				const ticker = new Ticker(100);

				expect(ticker.interval).to.equal(100);
			});

			it('if invalid type - throws an error', () => {
				function wrapper () {
					// @ts-expect-error test errors
					new Ticker('not a number');
				}

				expect(wrapper).to.throw(Error);
			});

			it('if lower than 50 - throws an error', () => {
				function wrapper () {
					new Ticker(49);
				}

				expect(wrapper).to.throw(Error);
			});
		});

		describe('with `tickHandler` argument', () => {
			it('returns a `Ticker` instance', () => {
				const ticker = new Ticker(100, noop);

				expect(ticker instanceof Ticker).to.be.true;
			});

			it('if valid - sets the `tickHandler` value', () => {
				const ticker = new Ticker(100, noop);

				expect(ticker.tickHandler).to.equal(noop);
			});

			it('if invalid - throws an error', () => {
				function wrapper () {
					// @ts-expect-error test errors
					new Ticker(100, 'not a function');
				}

				expect(wrapper).to.throw(Error);
			});
		});

		describe('with `tickOnStart = false`', () => {
			it('returns a `Ticker` instance', () => {
				const ticker = new Ticker(100, noop, false);

				expect(ticker instanceof Ticker).to.be.true;
			});

			it('sets `tickOnStart` to `false`', () => {
				const ticker = new Ticker(100, noop, false);

				expect(ticker.tickOnStart).to.be.false;
			});
		});

		describe('with `tickOnStart = true`', () => {
			it('returns a `Ticker` instance', () => {
				const ticker = new Ticker(100, noop, true);

				expect(ticker instanceof Ticker).to.be.true;
			});

			it('sets `tickOnStart` to `true`', () => {
				const ticker = new Ticker(100, noop, true);

				expect(ticker.tickOnStart).to.be.true;
			});
		});

		describe('without `tickOnStart`', () => {
			it('sets `tickOnStart` to `true` by default', () => {
				const ticker = new Ticker(100, noop);

				expect(ticker.tickOnStart).to.be.true;
			});
		});

		describe('with `timeoutObject`', () => {
			it('uses the given `setTimeout` method', () => {
				const timeoutObject = {
					setTimeout: sinon.spy(),
					clearTimeout: sinon.spy(),
				};

				const ticker = new Ticker(100, noop, false, timeoutObject);

				ticker.start();
				expect(timeoutObject.setTimeout.callCount, 'setTimeout.callCount').to.equal(1);

				ticker.stop().reset();
			});

			it('uses the given `clearTimeout` method', () => {
				const timeoutObject = {
					setTimeout: sinon.spy(),
					clearTimeout: sinon.spy(),
				};

				const ticker = new Ticker(100, noop, false, timeoutObject);

				ticker.start();
				ticker.stop().reset();
				expect(timeoutObject.clearTimeout.callCount, 'clearTimeout.callCount').to.equal(1);
			});
		});

		describe('without `timeoutObject`', () => {
			it('uses `window.setTimeout` method by default', () => {
				const ticker = new Ticker(100, noop, false);
				const spy = sinon.spy(window, 'setTimeout');

				expect(spy.callCount, 'setTimeout.callCount').to.equal(0);
				ticker.start();
				expect(spy.callCount, 'setTimeout.callCount').to.equal(1);

				ticker.stop().reset();
				spy.restore();
			});

			it('uses `window.clearTimeout` method by default', () => {
				const ticker = new Ticker(100, noop, false);
				const spy = sinon.spy(window, 'clearTimeout');

				expect(spy.callCount, 'clearTimeout.callCount').to.equal(0);
				ticker.start();
				expect(spy.callCount, 'clearTimeout.callCount').to.equal(0);
				ticker.stop().reset();
				expect(spy.callCount, 'clearTimeout.callCount').to.equal(1);
				spy.restore();
			});
		});
	});
}
