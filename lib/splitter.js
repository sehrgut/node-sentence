var StringSet = require('./collections').StringSet;

function Regex (text, re) {
	if (! re instanceof RegExp)
		re = new RegExp(re, "g");

	this.next = re.exec.bind(re, text);
}

function Words (text) {
	var re = /[^\s0-9\.,-\/#!$%\^&\*;:{}=\-_`~()\[\]<>?]+/g
	var split = new Regex(text, re);
	this.next = split.next.bind(split);
}

function UniqueWords (text, caseSensitive) {

	caseSensitive = typeof caseSensitive == 'undefined' ? false : caseSensitive;
	
	var feat = new Words(text);
	var seen = new StringSet();
	
	var getNext = caseSensitive ?
		feat.next.bind(feat) :
		function getNextLower() {
			var tok = feat.next();
			return tok == null ? tok : String.prototype.toLowerCase.call(tok);
		};
	
	this.next = function() {
		var tok = null;
	 	while (tok = getNext()) {
			if (! seen.has(tok)) {
				seen.add(tok);
				break;
			}
		}
		return tok;
	};

}
module.exports = {
	Regex: Regex,
	Words: Words,
	UniqueWords: UniqueWords
};