var fs = require('graceful-fs');
var feat = require('../').features,
	UniqueAsync = feat.UniqueAsync,
	Tokenizer = feat.Tokenizer;

var data = fs.readFileSync(process.argv[2], {encoding: 'utf8'});

for (var i=0; i<1; i++) {
	var toks = [];

	var t = new UniqueAsync(
		function (tok) { if (tok) toks.push(tok); },
		function () { console.log(toks.length + " unique word tokens"); }
	);
	t.add(data);
	t.end();

	var t = new Tokenizer(Tokenizer.patterns.WORDS);
	t.onToken(function (tok) { if (tok) toks.push(tok); });
	t.onEof(function () { console.log(toks.length + " word tokens"); });

	t.add(data);
	t.setEof();
}
