var Datas = require('../datas'),
	tronconsNantes = require('./tronconsNantes.json'),
	osc = require('node-osc');

var client = new osc.Client('10.0.5.159', 3333);

var datas = new Datas({
	forecast: 'bbe6179938ef0866087e02efb6cb2e0c',
	google: 'AIzaSyBmGs_cJWV5LY05kfcaI3PjcDRnnRgghHY',
	twitter: {
		consumer_key: 'DaHr8b09VKTdaKxAdI1fxb7Gl',
		consumer_secret: 'lRbyJjH69CKlgxJmJWCX2b35dlbpHmSZbOQQLW9i1r0pZnhGIb',
		access_token_key: '102975831-6AR97bz9EbfVrS4W7EO9XFZ3bIgcIydVtHek1y4N',
		access_token_secret: 'Et1611x7YrU2GV1LtPg3VJoKZ0fjA8IDMrlEdEF7Bh7wa'
	},
	nantes: '51G0VBM9453IF7R',
	jcdecaux: 'ee209151088f8b12d6ccc22bc115588f51615c14'
});

datas.on('weather', function(data) {
	//console.log(data.currently.temperature);
	console.dir(data.currently);
	client.send('/weather', JSON.stringify(data.currently));
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
	var parkings = data.opendata.answer.data.Groupes_Parking.Groupe_Parking;
	var placesDispo = 0;
	parkings.forEach(function(parking) {
		placesDispo += parseInt(parking.Grp_disponible, 10);
	});
	console.log(placesDispo);
	//client.send('/parkingNantes', JSON.stringify(data.opendata.answer.data.Groupes_Parking.Groupe_Parking));
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

datas.on('pollution', function(data) {
	console.log(data);
	client.send('/pollution', JSON.stringify(data));
});


datas.on('ratp', function(data) {
	console.log(data);
});

//datas.weather('Nantes');
//datas.twitterSample();
//datas.twitterTrack(['fun']);
//datas.finance();
//datas.circulationNantes();
//datas.parkingNantes();
//datas.lemonde();
//datas.nouvelobs();
//datas.liberation();
//datas.humanite();
//datas.velosJcdecaux('Marseille'); // nantes, paris, lyon, marseille
//datas.weather('Nantes');
//datas.weather('Shanghai');
//datas.weather('Beijing');
//datas.weather('Paris');
//datas.ratp('barbes+rochechouart', 2, 'A');
datas.pollution('Nantes');
datas.pollution('Rennes');
datas.pollution('Shanghai');
datas.pollution('Beijing');
datas.pollution('Paris');
