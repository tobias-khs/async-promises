'use strict';

import test from 'ava';
import * as asyncP from '../src/async-promises.js';

test('parallel', t => {
	var callOrder = [];
	asyncP.parallel([
		function() {
			return new Promise(function(resolve) {
				setTimeout(() => {
					callOrder.push(1);
					resolve(1);
				}, 50);
			});
		},
		function() {
			return new Promise(function(resolve) {
				setTimeout(() => {
					callOrder.push(2);
					resolve(2);
				}, 75);
			});
		},
		function() {
			return new Promise(function(resolve) {
				setTimeout(() => {
					callOrder.push(3);
					resolve([3, 3]);
				}, 25);
			});
		}
	])
	.then((results) => {
		t.same(callOrder, [3, 1, 2]);
		t.same(results, [1, 2, [3, 3]]);
	}, (err) => {
		t.fail(`should not throw an error: ${err}`);
	})
	.then(t.end);
});

test('parallel empty array', t => {
	asyncP.parallel([])
	.then((results) => {
		t.same(results, []);
	}, (err) => {
		t.fail(`should not throw an error: ${err}`);
	})
	.then(t.end);
});

test('parallel error', t => {
	var callOrder = [];
	asyncP.parallel([
		function() {
			return new Promise(function(resolve) {
				throw new Error('error');
			});
		},
		function() {
			return new Promise(function(resolve) {
				setTimeout(() => {
					callOrder.push(2);
					resolve(2);
				}, 25);
			});
		},
	])
	.then(() => {
		t.fail('should not be called');
	}, (err) => {
		t.pass(`should not throw an error: ${err}`);
	})
	.then(t.end);
});

test('parallel object', t => {
	var callOrder = [];
	asyncP.parallel({
		one() {
			return new Promise(function(resolve) {
				setTimeout(() => {
					callOrder.push(1);
					resolve(1);
				}, 50);
			});
		},
		two() {
			return new Promise(function(resolve) {
				setTimeout(() => {
					callOrder.push(2);
					resolve(2);
				}, 75);
			});
		},
		three() {
			return new Promise(function(resolve) {
				setTimeout(() => {
					callOrder.push(3);
					resolve([3, 3]);
				}, 25);
			});
		}
	})
	.then((results) => {
		t.same(callOrder, [3, 1, 2]);
		t.same(results, {
			one: 1,
			two: 2,
			three: [3, 3]
		});
	}, (err) => {
		t.fail(`should not throw an error: ${err}`);
	})
	.then(t.end);
});

test('paralel falsy return values', t => {
	asyncP.parallel({
		falseValue() {
			return Promise.resolve(false);
		},
		undefinedValue() {
			return;
		},
		emptyValue() {
			return Promise.resolve();
		},
		nullValue() {
			return null;
		}
	})
	.then((results) => {
		t.is(results.falseValue, false);
		t.is(results.undefinedValue, undefined);
		t.is(results.emptyValue, undefined);
		t.is(results.nullValue, null);
	}, (err) => {
		t.fail(`should not throw an error: ${err}`);
	})
	.then(t.end);
});