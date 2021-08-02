import sinon from 'sinon';
import {expect} from 'chai';

import { Ticker } from '../src/Ticker';
import { noop } from '../src/common';

export default function instanceCreation (): void {
	describe('Static Creator function', () => {
		it('returns a ticker instance', () => {
			const ticker = Ticker.create();

			expect(ticker.interval).to.be.undefined;
			expect(ticker.tickHandler).to.equal(noop);
		});

		it('create(interval)', () => {
			const ticker = Ticker.create(100);

			expect(ticker.interval).to.equal(100);
			expect(ticker.tickHandler).to.equal(noop);
		});

		it('create(tickHandler)', () => {
			// test overload: not using noop because it could pass where tickHandler fails
			const tickHandler = () => console.log(1);
			const ticker = Ticker.create(tickHandler);

			expect(ticker.interval).to.be.undefined;
			expect(ticker.tickHandler).to.equal(tickHandler);
		});

		it('create(interval, tickHandler)', () => {
			const tickHandler = () => console.log(1);
			const ticker = Ticker.create(100, tickHandler);

			expect(ticker.interval).to.equal(100);
			expect(ticker.tickHandler).to.equal(tickHandler);
		});
	});

	describe('Constructor', () => {
		describe('with no arguments', () => {
			it('sets default values', () => {
				const ticker = new Ticker();

				expect(ticker.interval).to.be.undefined;
				expect(ticker.tickHandler).to.equal(noop);
				expect(ticker.tickOnStart).to.be.true;
			});
		});

		describe('{interval: number}', () => {
			it('if valid - sets the `interval` value', () => {
				const ticker = new Ticker({interval: 100});

				expect(ticker.interval).to.equal(100);
			});

			it('if invalid type - throws an error', () => {
				function wrapper () {
					// @ts-expect-error test type validation
					new Ticker({interval: 'not a number'});
				}

				expect(wrapper).to.throw(Error);
			});

			it('if lower than 50 - throws an error', () => {
				function wrapper () {
					new Ticker({interval: 49});
				}

				expect(wrapper).to.throw(Error);
			});
		});

		describe('{tickHandler: function}', () => {
			it('if valid - sets the `interval` value', () => {
				const ticker = new Ticker({tickHandler: noop});

				expect(ticker.tickHandler).to.equal(noop);
			});

			it('if invalid type - throws an error', () => {
				function wrapper () {
					// @ts-expect-error test type validation
					new Ticker({tickHandler: 'not a function'});
				}

				expect(wrapper).to.throw(Error);
			});
		});

		describe('{tickOnStart: boolean}', () => {
			it('sets the `tickOnStart` flag', () => {
				const tickerWithTrue = new Ticker({ tickOnStart: true });
				const tickerWithFalse = new Ticker({ tickOnStart: false });

				expect(tickerWithTrue.tickOnStart).to.be.true;
				expect(tickerWithFalse.tickOnStart).to.be.false;
			});
		});

		describe('{timeoutObject: {setTimeout, clearTimeout}}', () => {
			it('uses the given `setTimeout` method', () => {
				const timeoutObject = {
					setTimeout: sinon.spy(),
					clearTimeout: sinon.spy(),
				};

				const ticker = new Ticker({
					interval: 100,
					timeoutObj: timeoutObject,
				});

				expect(timeoutObject.setTimeout.callCount, 'setTimeout.callCount').to.equal(0);
				ticker.start();
				expect(timeoutObject.setTimeout.callCount, 'setTimeout.callCount').to.equal(1);

				ticker.stop().reset();
			});

			it('uses the given `clearTimeout` method', () => {
				const timeoutObject = {
					setTimeout: sinon.spy(),
					clearTimeout: sinon.spy(),
				};

				const ticker = new Ticker({
					interval: 100,
					timeoutObj: timeoutObject,
				});

				ticker.start();

				expect(timeoutObject.clearTimeout.callCount, 'clearTimeout.callCount').to.equal(0);
				ticker.stop();
				expect(timeoutObject.clearTimeout.callCount, 'clearTimeout.callCount').to.equal(1);

				ticker.reset();
			});

			it('uses the global\'s `setTimeout` method by default', () => {
				const spy = sinon.spy(globalThis, 'setTimeout');
				const ticker = new Ticker({ interval: 100 });

				expect(spy.callCount, 'setTimeout.callCount').to.equal(0);
				ticker.start();
				expect(spy.callCount, 'setTimeout.callCount').to.equal(1);

				ticker.stop().reset();
				spy.restore();
			});

			it('uses the global\'s `clearTimeout` method by default', () => {
				const spy = sinon.spy(globalThis, 'clearTimeout');
				const ticker = new Ticker({ interval: 100 });

				ticker.start();

				expect(spy.callCount, 'clearTimeout.callCount').to.equal(0);
				ticker.stop();
				expect(spy.callCount, 'clearTimeout.callCount').to.equal(1);

				ticker.reset();
				spy.restore();
			});

			it('if invalid - throws an error', () => {
				function wrapper () {
					// @ts-expect-error test type validation
					new Ticker({timeoutObj: 'not a timeout object'});
				}

				expect(wrapper).to.throw('both `setTimeout` and `clearTimeout`');
			});
		});
	});
}
