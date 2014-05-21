## Module facilitant l'accès à diverses API

### Fonctionalités

- temps: requête le temps d'une ville donnée
- twitter: requête les tweets selon des mots clefs
- finance: requête le CAC40, Footsie et Nasdaq
- circulation de Nantes: requête la circulation dans Nantes
- parkings de Nantes: requête les places de parking public dispo
- lemonde: récupère les dernières brèves
- nouvelobs: récupère les dernières brèves
- liberation: récupère les dernières brèves
- humanite: récupère les dernières brèves
- jcdecaux: requête la disponibilité des vélos
- aqi: air quality index

### Nécessité d'inscrption aux services

- https://dev.twitter.com/
- https://developer.jcdecaux.com/#/home
- https://cloud.google.com/console/project
- https://developer.forecast.io/
- http://data.nantes.fr/

### Usage

Créer un dossier de projet, puis installer ce module: `npm install dataviz-tangible`

Créer l'objet de configuration d'accès aux services :

```javascript
var Datas = require('../datas');

var datas = new Datas({
	forecast: 'myAPIKey',
	google: 'myAPIKey',
	twitter: {
		consumer_key: 'myAPIKey',
		consumer_secret: 'myAPIKey',
		access_token_key: 'myAPIKey',
		access_token_secret: 'myAPIKey'
	},
	nantes: 'myAPIKey',
	jcdecaux: 'myAPIKey'
});
```

Vous pouvez désormais faire appel aux services disponibles.


Par exemple, requêter le temps:

```javascript
// définir comment gérer la réponse du service météo
datas.on('weather', function(data) {
	console.log(data.currently.temperature);
});
// lancer un appel au service météo
datas.weather('Nantes');
```

Voir le fichier `examples/demo.js` pour l'usage des autres services.
