var _ = require('lodash');
var features = require('./features');
// todo: tokenizer return offsets, so original data can be substringed out.



function contstrip(a, x) {
	return _.contains(a, String(x).replace(/\s/g, ''));
}

// http://codereview.stackexchange.com/a/11137

var noLeading = [ '.', ',', ';', ':', ')', ']', '}', '...', '....', '/', '\\' ];
var noFollowing = [ '(', '[', '{', '/', '\\' ];

function detokenize(a) {
	var out = '';

	var prev = null;
	var curr = null;	
	for (var i=0, n=a.length; i<n; i++) {
		curr = a[i];
		
		if (! out || contstrip(noLeading, curr) || contstrip(noFollowing, prev)) {
			out += curr;
		} else {
			out += ' ' + curr;
		}
		
		prev = curr;
	}
	
	return out;
}


var abbrevs = ['mr', 'mrs', 'ms', 'dr', 'mssr', 'msrrs', 'mlle',
	'rev', 'lt', 'col', 'sgt', 'eg', 'e', 'g', 'ie'];

var endings = ['.', '?', '!', '...', '....'];

function SentenceTokenizer(onToken, onEof) {

	var tokens = [];
	
	var feat = new features.Tokenizer(features.Tokenizer.patterns.WORDS_AND_PUNCTUATION);
	
	this.add = function (s) {
		feat.add(s);
	};

	this.setEof = function () {
		feat.setEof();
	};

	function _onToken(tok) {
		tokens.push(tok);
		// does not handle outside quotes
		if (_.contains(endings, tok)) {
			var prev = tokens.slice(-2, tokens.length - 1);
			if (! _.contains(abbrevs, String(prev).toLowerCase()))
				onToken(detokenize(tokens.splice(0)));
		}
	}
	
	function _onEof() {
		if (tokens.length)
			onToken(detokenize(tokens.splice(0)));
		onEof();
	}

	feat.onToken(_onToken);
	feat.onEof(_onEof);
}

module.exports = {
	detokenize: detokenize,
	SentenceTokenizer: SentenceTokenizer
};
