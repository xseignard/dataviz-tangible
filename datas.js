var Geocoder = require('node-geocoder'),
	Forecast = require('forecast'),
	Twitter = require('ntwitter'),
	YahooFinance = require('yahoo-finance'),
	cheerio = require('cheerio'),
	http = require('http'),
	https = require('https'),
	util = require('util'),
	EventEmitter = require('events').EventEmitter;

var datasEventNames = {
	weather: 'weather',
	twitterSample: 'twitterSample',
	twitterTrack: 'twitterTrack',
	finance: 'finance',
	circulationNantes: 'circulationNantes',
	parkingNantes: 'parkingNantes',
	lemonde: 'lemonde',
	nouvelobs: 'nouvelobs',
	liberation: 'liberation',
	humanite: 'humanite',
	jcdecaux: 'jcdecaux'
};

var Datas = function(opts) {
	EventEmitter.call(this);
	opts = opts || {};
	// service to translate town to lat/long
	this.geocoder = Geocoder.getGeocoder('google', 'http', {apiKey: opts.google});
	// service to get weather
	this.forecast = new Forecast({
		service: 'forecast.io',
		key: opts.forecast,
		units: 'celcius',
		cache: false
	});
	// service to get twitter
	this.twitter = new Twitter(opts.twitter);
	// nantes open data token
	this.nantes = opts.nantes;
	// jc decaux open data token
	this.jcdecaux = opts.jcdecaux;
};
util.inherits(Datas, EventEmitter);

Datas.prototype.requestJSON = function(url, eventName) {
	var _self = this;
	var secure = url.charAt(4);
	var protocol = secure === 's' ? https : http;
	protocol.get(url, function(res) {
		var responseParts = [];
		res.setEncoding('utf8');
		res.on('data', function(chunk) {
			responseParts.push(chunk);
		});
		res.on('end', function(){
			var data = JSON.parse(responseParts.join(''));
			_self.emit(eventName, data);
		});
	}).on('error', function(err) {
		console.log(err);
	});
};

Datas.prototype.requestHeadlines = function(url, eventName, parseFunction) {
	var _self = this;
	http.get(url, function(res) {
		var responseParts = [];
		res.setEncoding('utf8');
		res.on('data', function(chunk) {
			responseParts.push(chunk);
		});
		res.on('end', function(){
			var res = responseParts.join('');
			var articles = parseFunction(res);
			_self.emit(eventName, articles);
		});
	}).on('error', function(err) {
		console.log(err);
	});
};

Datas.prototype.geoCode = function(town, callback) {
	this.geocoder.geocode(town, function(err, res) {
		if(err) console.log(err);
		callback(res);
	});
};

Datas.prototype.weather = function(town) {
	var _self = this;
	this.geoCode(town, function(res) {
		var location = [res[0].latitude, res[0].longitude];
		_self.forecast.get(location, function(err, weather) {
			if(err) console.log(err);
			_self.emit(datasEventNames.weather, weather);
		});
	});
};

Datas.prototype.twitterSample = function() {
	var _self = this;
	this.twitter.stream('statuses/sample',function(stream) {
		stream.on('data', function (data) {
			_self.emit(datasEventNames.twitterSample, data);
		});
	});
};

Datas.prototype.twitterTrack = function(trackedWords) {
	var _self = this;
	this.twitter.stream('statuses/filter', {track: trackedWords}, function(stream) {
		stream.on('data', function (data) {
			_self.emit(datasEventNames.twitterTrack, data);
		});
	});
};

// see http://www.jarloo.com/yahoo_finance/
Datas.prototype.finance = function() {
	var _self = this;
	// symbols: cac40, nasdaq, footsie 100
	// fields: name ('n'), last value ('l1'), change ('c')
	var params = {
		symbols: ['^FCHI', '^IXIC', '^FTSE'],
		fields: ['n', 'l1', 'c']
	};
	YahooFinance.snapshot(params, function (err, data) {
		var stocks = [];
		for (var symbol in data) {
			stocks.push(data[symbol]);
		}
		_self.emit(datasEventNames.finance, stocks);
	});
};

Datas.prototype.circulationNantes = function() {
	var url = 'http://data.nantes.fr/api/getFluiditeAxesRoutiers/1.0/' + this.nantes + '/?output=json';
	this.requestJSON(url, datasEventNames.circulationNantes);
};

Datas.prototype.parkingNantes = function() {
	var url = 'http://data.nantes.fr/api/getDisponibiliteParkingsPublics/1.0/' + this.nantes + '/?output=json';
	this.requestJSON(url, datasEventNames.parkingNantes);
};

Datas.prototype.lemonde = function() {
	var url = 'http://www.lemonde.fr/actualite-en-continu/';
	var parseFunction = function(res) {
		var $ = cheerio.load(res);
		var articles = [];
		var content = $('.fleuve').contents().find('.conteneur_fleuve');
		content.each(function(i, elem) {
			var current = $(this).find('.grid_8.omega').first();
			var article = {};
			article.headline = current.find('h3').text().trim();
			article.excerpt = current.find('p').text().trim();
			articles.push(article);
		});
		return articles;
	};
	this.requestHeadlines(url, datasEventNames.lemonde, parseFunction);
};

Datas.prototype.nouvelobs = function() {
	var url = 'http://tempsreel.nouvelobs.com/depeche/';
	var parseFunction = function(res) {
		var $ = cheerio.load(res);
		var articles = [];
		var contents = $('.obs-headlines').contents().find('h2');
		contents.each(function(i, elem) {
			var article = {};
			article.headline = $(this).text();
			articles.push(article);
		});
		return articles;
	};
	this.requestHeadlines(url, datasEventNames.nouvelobs, parseFunction);
};

Datas.prototype.liberation = function() {
	var url = 'http://www.liberation.fr/depeches,51';
	var parseFunction = function(res) {
		var $ = cheerio.load(res);
		var articles = [];
		var contents = $('.timeline').contents().find('li');
		contents.each(function(i, elem) {
			var article = {};
			article.headline = $(this).contents().find('h2').text();
			articles.push(article);
		});
		return articles;
	};
	this.requestHeadlines(url, datasEventNames.liberation, parseFunction);
};

Datas.prototype.humanite = function() {
	var url = 'http://www.humanite.fr/fil_rouge';
	var parseFunction = function(res) {
		var $ = cheerio.load(res);
		var articles = [];
		var contents = $('.view-huma-fil-rouge').contents().find('.views-row');
		contents.each(function(i, elem) {
			var article = {};
			article.headline = $(this).contents().find('span').first().text();
			article.excerpt = $(this).contents().find('div').first().text();
			articles.push(article);
		});
		return articles;
	};
	this.requestHeadlines(url, datasEventNames.humanite, parseFunction);
};

Datas.prototype.velosJcdecaux = function(town) {
	var url = 'https://api.jcdecaux.com/vls/v1/stations?contract=' + town + '&apiKey=' + this.jcdecaux;
	this.requestJSON(url, datasEventNames.jcdecaux);
};

module.exports = Datas;
