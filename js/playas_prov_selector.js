console.info("PROVINCIAS - - - - - - - - - - - - - - - - - - - - - - - - - - - ");
var provincia = document.querySelectorAll("#provincia_selector option");
var PROVINCIAS = [];

for(i=1;i<=provincia.length-1;i++){
	// i = 1 > to avoid first empty option from select
	provincias(i);
}

function provincias(i) {
	//{nombre: "string",id: number}
	var prov = {
		id: provincia[i].attributes["0"].nodeValue,
		nombre: provincia[i].outerText
	};
	//onsole.log(prov);
	PROVINCIAS.push(prov);
	console.log('{id:'+provincia[i].attributes["0"].nodeValue+', nombre:"'+provincia[i].outerText+'",localidades:""},');
}

console.info("LOCALIDADES - - - - - - - - - - - - - - - - - - - - - - - - - - - ");
var localidad = document.querySelectorAll("#datos_selector optgroup");

//var ddbb = {};
var localidades = [];

for(i=0;i<=localidad.length-1;i++){
	getLocalidades(i);
}

function getLocalidades(i) {

	var ciudad = localidad[i].attributes["0"].textContent;
	//ciudad = ciudad.toLowerCase();
	// ADD CIUDADES
	getPlayas(i,ciudad);

}

var playas = document.querySelectorAll("#datos_selector optgroup option");

function getPlayas(n,city) {

	var obj = playas;
	//console.log(city);

	var arr = [];

	for (var prop in obj) {

		var parent = obj[prop].parentElement;

		if(parent != undefined){

			parent = parent.label;

			if(parent === city){

				var b_key = obj[prop].text;

				var itemID = obj[prop].value;
					var indx = itemID.lastIndexOf("-");
					var lngth = itemID.length;
					itemID = itemID.slice(indx+1);

				var beach = {
					id : itemID,
					name : b_key
				};

				arr.push(beach);

			}
		}

	};

	var newLoc = {};

	newLoc = {

		localidad: city,
		playas: arr

	};

	localidades.push(newLoc);
	console.log(newLoc);

}