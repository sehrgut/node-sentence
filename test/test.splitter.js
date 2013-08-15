var splitter = require('../').features.splitter;

module.exports = {
	'split words': function (test) {
		test.expect(4);

		var words = ['Who', 'are', 'you', 'now'];
		var testStr = words.join(' ') + '?';
		var split = null;
		
		test.doesNotThrow(function () {
			split = new splitter.Words(testStr);
		}, Error, "create");
		
		var out = [];
		test.doesNotThrow(function () {
			var tmp = null;
			while (tmp = split.next())
				out.push(tmp);
		}, Error, "split all words");
		
		test.equal(out.length, words.length, "correct number of words");

		test.doesNotThrow(function () {
			for (var i=0, n=out.length; i<n; i++)
				if (out[i] != words[i])
					throw new Error("Words don't match");
		}, Error, "words match");
		
		test.done();
	},
	'split ipv4 address': function (test) {
		test.expect(4);
		
		var parts = [128, 0, 0, 1];
		var addr = parts.join('.');
		var re = /[0-9]+/g;
		var split = null;
		
		test.doesNotThrow(function () {
			split = new splitter.Regex(addr, re);
		}, Error, "create");
		
		var out = [];
		
		test.doesNotThrow(function () {
			var tmp = null;
			while (tmp = split.next())
				out.push(tmp);
		}, Error, "split parts");
		
		test.equal(out.length, parts.length, "correct number of parts");
		test.equal(out.join('.'), addr, "address match");

		test.done();
	},
	'split unique words case-insensitive': function (test) {
		test.expect(4);
		
		var txt = "Rome Day Who rome day who foo";
		var expected = ['rome', 'day', 'who', 'foo'];
		var split = null;
		test.doesNotThrow(function () {
			split = new splitter.UniqueWords(txt, false);
		}, Error, "create");

		var out = [];
		test.doesNotThrow(function () {
			var tmp = null;
			while (tmp = split.next())
				out.push(tmp);
		}, console.log, "split words");
		
		test.equal(out.length, expected.length, "correct number of words");
		test.equal(out.join(' '), expected.join(' '), "correct words and order");
		
		test.done();
	},
	'split unique words case-sensitive': function (test) {
		test.expect(4);
		
		var txt = "A B a B c";
		var expected = ['A', 'B', 'a', 'c'];
		var split = null;
		test.doesNotThrow(function () {
			split = new splitter.UniqueWords(txt, true);
		}, Error, "create");

		var out = [];
		test.doesNotThrow(function () {
			var tmp = null;
			while (tmp = split.next())
				out.push(tmp);
		}, console.log, "split words");
		
		test.equal(out.length, expected.length, "correct number of words");
		test.equal(out.join(' '), expected.join(' '), "correct words and order");
		
		test.done();
	}
};