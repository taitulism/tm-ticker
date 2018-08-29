module.exports = function logTableHead (testName, startingAt) {
};

module.exports = {
	head (testName, startingAt) {
		console.log('');
		console.log('*****************************************');
		console.log(`***** ${testName}`);
		console.log(`***** Starting at ${startingAt}`);
		console.log('*****************************************');
		console.log('┌────┬─────────┬──────────┬─────────────┐');
		console.log('|  # │  Idealy │  Actual  │   Diff      │');
		console.log('├────┼─────────┼──────────┼─────────────┤');
	},

	row (tickNum, ideal, actual, diff) {
		console.log(`│ ${tickNum} │  ${ideal} │  ${actual}  │ ${diff} │`);
	},

	tail () {
		console.log('└────┴─────────┴──────────┴─────────────┘');
	},
};