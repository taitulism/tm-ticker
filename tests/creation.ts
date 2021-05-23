import * as stow from 'set-timeout-worker';
import {expect} from 'chai';
import { Ticker, noop } from './common';

export default function instanceCreation () {
	describe('Instance Creation', () => {
		describe('with no arguments', () => {
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
				const myTicker = new Ticker(undefined, noop);

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
					// @ts-expect-error
					new Ticker('not a number', noop);
				}

				expect(wrapper).to.throw(Error);
			});

			it('throws an error on invalid callback', () => {
				function wrapper () {
					// @ts-expect-error
					new Ticker(1000, 'not a function');
				}

				expect(wrapper).to.throw(Error);
			});
		});
	});
};
