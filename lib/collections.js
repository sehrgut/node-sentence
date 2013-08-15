var _ = require('lodash');


function Map() {
	this._contents = {};
};

Map.prototype.__defineGetter__('length', function () {
	return _.size(this._contents);
});

Map.prototype.contains = function (k) {
	return _.has(this._contents, k);
};

Map.prototype.put = function (k, v) {
	this._contents[k] = v;
};

Map.prototype.get = function (k) {
	if (this.contains(k))
		return this._contents[k];
};

Map.prototype.remove = function (k) {
	delete this._contents[k];
};

Map.prototype.keys = function () {
	return _.keys(this._contents);
};

Map.prototype.values = function () {
	return _.values(this._contents);
};

Map.prototype.toArray = function () {
	return _.pairs(this._contents);
};




function StringSet() {
	this._contents = new Map();

	_.each(arguments, function (arg, i) {
		if (_.isArray(arg))
			this.addAll(arg);
		else
			this.add(arg);
	}, this);

};

StringSet.prototype.add = function (str) {
	this._contents.put(str, true);
};

StringSet.prototype.addAll = function (arr) {
	_.each(arr, function (str) {
		this.add(str);
	}, this);
};

StringSet.prototype.has = function (str) {
	return this._contents.contains(str);
};

StringSet.prototype.remove = function (str) {
	this._contents.remove(str);
};

StringSet.prototype.count = function () {
	return this._contents.length;
};

StringSet.prototype.intersect = function (b) {
	return StringSet.intersect(this, b);
};

StringSet.prototype.intersectCount = function (b) {
	return StringSet.intersectCount(this, b);
};

StringSet.prototype.union = function (b) {
	return StringSet.union(this, b);
};

StringSet.prototype.unionCount = function (b) {
	return StringSet.unionCount(this, b);
};

StringSet.prototype.diff = function (b) {
	return StringSet.diff(this, b);
};

StringSet.prototype.diffCount = function (b) {
	return StringSet.diffCount(this, b);
};

StringSet.prototype.elements = function () {
	return this._contents.keys();
};

StringSet.intersect = function (a, b) {
	var p = (a.count() < b.count() ? a : b);
	var s = (a.count() < b.count() ? b : a);
	
	return p.elements().reduce(function (S, el) {
		if (s.has(el)) S.add(el);
		return S;
	}, new StringSet());
};

StringSet.intersectCount = function (a, b) {
	var p = (a.count() < b.count() ? a : b);
	var s = (a.count() < b.count() ? b : a);
	
	return p.elements().reduce(function (n, el) {
		return s.has(el) ? ++n : n;
	}, 0);
};

StringSet.union = function (a, b) {
	return new StringSet(a.elements(), b.elements());
};

StringSet.unionCount = function (a, b) {
	var p = (a.count() < b.count() ? a : b);
	var s = (a.count() < b.count() ? b : a);
	
	return s.count() + s.diffCount(p);
};

StringSet.diff = function (a, b) {
	return b.elements().reduce(function (S, el) {
		if (! a.has(el))
			S.add(el);
		return S;
	}, new StringSet());
};

StringSet.diffCount = function (a, b) {
	return b.elements().reduce(function (n, el) {
		return a.has(el) ? n : ++n;
	}, 0);
};

module.exports = {
	Map: Map,
	StringSet: StringSet
};