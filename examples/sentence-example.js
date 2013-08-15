var SentenceTokenizer = require('../').sentence.SentenceTokenizer;

function onToken(tok) {
	console.log(tok);
}

function onEof() {
	console.log('FINI');
}


var feat = new SentenceTokenizer(onToken, onEof);

var txt = "Lo-rem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sodales erat et Mr. Bean odio lacinia, eu hendrerit sem egestas. Cras mattis porta tortor, in sagittis ante placerat quis. Ut elit neque, commodo nec lobortis vitae, ultricies nec erat. Donec id enim aliquam dui viverra aliquam eu id libero. Duis ligula massa, ultricies sed vulputate sit amet, gravida ac sem. Eti"

var txt2 = "am vitae laoreet odio. Vestibulum sit amet malesuada sapien, sed vestibulum sem. Etiam sed elementum libero. Sed blandit mauris vel odio malesuada, in pulvinar lorem scelerisque. Sed sodales a magna non bibendum. Proin dolor velit, blandit vel semper vel, tristique quis mauris. Nunc sed sem dictum tellus malesuada ullamcorper nec vitae ante. Aenean pulvinar urna porta sapien consequat, ut congue tortor pellentesque... Ut non nibh non (magna [pharetra] tincidunt) ut in neque. Morbi sodales tincidunt sapien eget vestibulum. ..."

feat.add(txt);
feat.add(txt2);
feat.setEof();
