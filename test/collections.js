var coll = require('../lib/collections');

var tests = module.exports;

tests['set creation'] = function (test) {
	var a = ['a', 'b', 'c', 'd'];
	var A = new coll.StringSet(a);
	
	test.expect(3);
	
	test.ok(A.has('a'), 'element not found');
	test.equal(A.has('z'), false, 'bad element found');
	test.equal(A.count(), a.length, 'wrong number of elements');
	
	test.done();
};

tests['set intersection'] = function (test) {
	var a = ['a', 'b'];
	var b = ['b', 'c'];
	var A = new coll.StringSet(a);
	var B = new coll.StringSet(b);
	var AnB = A.intersect(B);

	test.expect(4);
	
	test.equal(AnB.count(), 1, 'bad intersection');
	test.ok(AnB.has('b'), 'missing right element');
	test.equal(AnB.has('a'), false, 'has wrong element');
	test.equal(AnB.has('c'), false, 'has wrong element');
	
	test.done();
};

tests['set union'] = function (test) {
	var a = ['a', 'b'];
	var b = ['b', 'c'];
	var A = new coll.StringSet(a);
	var B = new coll.StringSet(b);
	var AuB = A.union(B);

	test.expect(4);
	
	test.equal(AuB.count(), 3, 'bad union');
	test.ok(AuB.has('b'), 'missing overlap element');
	test.ok(AuB.has('a'), 'missing element');
	test.ok(AuB.has('c'), 'missing element');
	
	test.done();
};

tests['set difference'] = function (test) {
	var a = ['a', 'b'];
	var b = ['b', 'c'];
	var A = new coll.StringSet(a);
	var B = new coll.StringSet(b);
	var AdB = A.diff(B);

	test.expect(4);
	
	test.equal(AdB.count(), 1, 'bad diff');
	test.equal(AdB.has('b'), false, 'has overlap element');
	test.equal(AdB.has('a'), false, 'has bad element');
	test.ok(AdB.has('c'), 'missing element');
	
	test.done();
};

tests['count operations'] = function (test) {
	var a = ['a', 'b', 'c'];
	var b = ['b', 'c', 'd', 'e'];
	var A = new coll.StringSet(a);
	var B = new coll.StringSet(b);
	
	test.expect(4);
	
	test.equal(A.intersectCount(B), 2, 'wrong intersect count');
	test.equal(A.unionCount(B), 5, 'wrong union count');
	test.equal(A.diffCount(B), 2, 'wrong diff count');
	test.equal(B.diffCount(A), 1, 'wrong diff count');
	
	test.done();
};










