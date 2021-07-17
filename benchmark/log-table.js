/* eslint-disable no-console */

module.exports = {
	head (testName, startingAt) {
		console.log('');
		console.log('*****************************************');
		console.log(`***** ${testName}`);
		console.log(`***** Starting at ${startingAt}`);
		console.log('*****************************************');
		console.log('┌────┬─────────┬──────────┬─────────────┐');
		console.log('|  # │  Target │  Actual  │   Diff      │');
		console.log('├────┼─────────┼──────────┼─────────────┤');
	},

	row (tickNum, target, actual, diff) {
		console.log(`│ ${tickNum} │  ${target} │  ${actual}  │ ${diff} │`);
	},

	tail () {
		console.log('└────┴─────────┴──────────┴─────────────┘');
	},
};
