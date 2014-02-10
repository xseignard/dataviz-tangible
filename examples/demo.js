var Datas = require('../datas'),
	tronconsNantes = require('./tronconsNantes.json');

var datas = new Datas({
	forecast: 'bbe6179938ef0866087e02efb6cb2e0c',
	google: 'AIzaSyBmGs_cJWV5LY05kfcaI3PjcDRnnRgghHY',
	twitter: {
		consumer_key: 'WQ7HAOeSjLMcI3foYk8LQ',
		consumer_secret: 'kfvxfs88CNQg7XbgYCJ8Uk7LA782lRGP3WCBSd5XnSc',
		access_token_key: '102975831-EHTdgy8BGcHJ2isDi0u98K8eZGCHH9WwNxteW7oX',
		access_token_secret: 'OYQ9rXSnbRtXQNnrGrZkLfwFaZSiFP5r2Ny9EEp6Z0SYg'
	},
	nantes: '51G0VBM9453IF7R',
	jcdecaux: 'ee209151088f8b12d6ccc22bc115588f51615c14'
});

datas.on('weather', function(data) {
	console.log(data.currently.temperature);
});

datas.on('twitterSample', function(data) {
	console.log(data.user.screen_name);
});

datas.on('twitterTrack', function(data) {
	console.log(data.text);
});

datas.on('finance', function(data) {
	for (var i = 0; i < data.length; i++) {
		var current = data[i];
		console.log(current.lastTradePriceOnly)
	};
});

datas.on('circulationNantes', function(data) {
	var troncons = data.opendata.answer.data.Troncons.Troncon;
	for (var i = 0; i < troncons.length; i++) {
		if (parseInt(troncons[i].Couleur_TP) > 4) {
			var currentId = parseInt(troncons[i].Id);
			for (var j = 0; j < tronconsNantes.length; j++) {
				if (tronconsNantes[j].id == currentId) {
					console.log(tronconsNantes[j].nom);
				}
			};

		}
	};
});

datas.on('parkingNantes', function(data) {
	console.log(data.opendata.answer.data.Groupes_Parking.Groupe_Parking);
});

datas.on('lemonde', function(data) {
	console.log(data);
});

datas.on('nouvelobs', function(data) {
	console.log(data);
});

datas.on('liberation', function(data) {
	console.log(data);
});

datas.on('humanite', function(data) {
	console.log(data);
});

datas.on('jcdecaux', function(data) {
	console.log(data);
});


//datas.weather('Nantes');
//datas.twitterSample();
//datas.twitterTrack(['dataviz', 'datavisualisation']);
//datas.finance();
//datas.circulationNantes();
//datas.parkingNantes();
//datas.lemonde();
//datas.nouvelobs();
//datas.liberation();
//datas.humanite();

datas.velosJcdecaux('Nantes');
