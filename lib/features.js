var fs = require('graceful-fs');
var StringSet = require('./collections').StringSet;
var splitter = require('./splitter');

function UniqueAsync (onConsume, onEnd) {
	var toks = new Tokenizer(Tokenizer.patterns.WORDS);
	var seen = new StringSet();
			
	this.add = function (data) {
		toks.add(data);
	};
	
	this.end = function () {
		toks.setEof();
	};
	
	toks.onToken(function (tok, err) {
		tok = tok.toLowerCase();
		if (! seen.has(tok)) {
			seen.add(tok);
			onConsume(tok);
		}
	});
	
	toks.onEof(function () {
		if (onEnd) onEnd();
	});
	
}

function Tokenize (text) {
	var re = /[^\s0-9\.,-\/#!$%\^&\*;:{}=\-_`~()\[\]<>?]/
	
	this.next = function () {
		var start = end = 0;
		while ( start < text.length && !re.test(text[start])) start++;
		end = start;
		while ( end < text.length && re.test(text[end])) end++;
		var word = text.substr(start, end - start);
		start = end;
		return word;
	}
	
}

function Tokenizer(pat) {
	var re = new RegExp(pat, 'g');
	var data = "";
	
	var eof = false;

	this.add = function(s) {
		if (eof) throw new Error("Cannot add data after EOF.");
		if (data) data = data.substr(re.index);
		data += s;
		consumeToEnd();
	};
	
	this.eof = function() {
		return eof;
	};
	
	this.setEof = function() {
		eof = true;
		consumeToEnd();
		doEof();
	};
	
	var consumers = [];
	this.onToken = function(cb) {
		consumers.push(cb);
	};
	
	var enders = [];
	this.onEof = function(cb) {
		enders.push(cb);
	};
	
	function next() {
		var match = re.exec(data);
		return match ? match[0] : null;
	};
	
	function doToken(tok) {
		for (var i=0, n=consumers.length; i<n; i++)
			consumers[i](tok, null);
	}
	
	function doEof() {
		for (var i=0, n=enders.length; i<n; i++)
			enders[i]();
	}
	
	function consumeToEnd() {
		var tok = null;
		while(tok = next()) {
			if (re.lastIndex < data.length || eof) {
				doToken(tok);
			} else {
				data = tok;
				re.lastIndex = 0;
				break;
			}
		}
		
		if (! tok) data = "";
	}
}

Tokenizer.patterns = {
	WORDS: /[^\s0-9\.,-\/#!$%\^&\*;:{}=\-_`~()\[\]<>?"]+/.source,
	WORDS_NO_HYPHENS: /[^\s0-9,\.-\/#!$%\^&\*;:{}=\-_`~()\[\]<>?"]+/.source,
	WORDS_AND_PUNCTUATION: /[^\s0-9,\.-\/#!$%\^&\*;:{}=_`~()\[\]<>?"]+|(\. ?){2,3}\.|[0-9,\.-\/#!$%\^&\*;:{}=_`~()\[\]<>?"]/.source,
	//http://stackoverflow.com/questions/5553410/regular-expression-match-a-sentence/5553924#5553924
	SENTENCES: /[^.!?\s][^.!?]*(?:[.!?](?!['"]?\s|$)[^.!?]*)*[.!?]?['"]?(?=\s|$)/gm.source
};

module.exports = {
	splitter: splitter,
	Tokenizer: Tokenizer,
	UniqueAsync: UniqueAsync
};
