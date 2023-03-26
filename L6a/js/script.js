// Globala variabler
var myApiKey = "c9c4bf633fce8bffb4de0c1e81e5085d";	// Ersätt DIN-API-KEY med din egen API key
var flickrImgElem;		// Referens till element där bilderna ska visas
var formElem;			// Referens till sökformuläret
var tags;				// Taggar som anges i sökformuläret
var pageNr;				// Aktuellt sidnummer
var pageNrElem;			// Referens till element för sidnummer
var largeImgElem;		// Objekt med referens till img och caption för förstorad bild
var imgLocationElem;	// Referens till element för bildens koordinater
var moreImgElem;		// Referens till element för fler bilder
var map;				// Objekt för kartan

// Initiering av globala variabler och händelsehanterare
function init() {
	flickrImgElem = document.getElementById("flickrImg");
	formElem = document.getElementById("searchForm");
	pageNrElem = document.getElementById("pageNr");
	largeImgElem = {
		img: document.querySelector("#largeImg img"),
		caption: document.querySelector("#largeImg figcaption")
	};
	imgLocationElem = document.getElementById("imgLocation");
	moreImgElem = document.getElementById("moreImg");
	formElem.searchBtn.addEventListener("click", serchImgs);
	document.getElementById("prevBtn").addEventListener("click", prevPage);
	document.getElementById("nextBtn").addEventListener("click", nextPage);
	pageNr = 1;
} // End init
window.addEventListener("load", init);

// -----------------------------------------------------------------------------------------

// Initiera en ny sökning
function serchImgs() {
	tags = formElem.tags.value; //referens till sökfältet 
	pageNr = 1; //vilket sidnummer man är på
	requestNewImgs();

} // End serchImgs

// Ajax-begäran av nya bilder
function requestNewImgs() {
	flickrImgElem.innerHTML = "<img src='img/progress.gif' style='border:none;'>";
	pageNrElem.innerHTML = pageNr;
	let request = new XMLHttpRequest(); // Object för Ajax-anropet
	request.open("GET", "https://api.flickr.com/services/rest/?api_key=" + myApiKey + "&method=flickr.photos.search&tags=" + tags + "&per_page=5&page=" + pageNr + "&format=json&nojsoncallback=1" + "&has_geo=1", true);//objekt för att söka bilder enligt geokoden
	request.send(null); // Skicka begäran till servern
	request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
		if (request.readyState == 4) // 4 = kommunikation upprättad 
			if (request.status == 200) newImgs(request.responseText); //200 = filen finns
			else flickrImgElem.innerHTML = "Den begärda resursen finns inte.";
	};
} // End requestNewImgs

// Tolka svaret och visa upp bilderna. Välj 5 slumpmässigt ur de 500.
function newImgs(response) {

	response = JSON.parse(response); //ojekt med data om ajax response
	flickrImgElem.innerHTML = ""; //tom string för variabeln flickrImgElem
	for (let i = 0; i < response.photos.photo.length; i++) {
		let photo = response.photos.photo[i]; // Ett foto i svaret
		let imgUrl = "https://live.staticflickr.com/" + photo.server + "/" +
			photo.id + "_" + photo.secret + "_s.jpg"; // Adress till en bild
		let newElem = document.createElement("img"); // Nytt img-element
		newElem.setAttribute("src", imgUrl);
		newElem.setAttribute("data-photo", JSON.stringify(photo)); // Spara data om fotot
		newElem.addEventListener("click", enlargeImg);
		flickrImgElem.appendChild(newElem);

	}; // End for
} // End newImgs

// Hämta föregående uppsättning bilder
function prevPage() {
	if (pageNr > 1) {
		pageNr--;
		requestNewImgs();
	};
} // End prevPage

// Hämta nästa uppsättning bilder
function nextPage() {
	pageNr++;
	requestNewImgs();
} // End nextPage

// Visa större bild av den som användaren klickat på
function enlargeImg() {
	let photo = JSON.parse(this.getAttribute("data-photo")); // Objekt med data om fotot
	let imgUrl = "https://live.staticflickr.com/" + photo.server + "/" +
		photo.id + "_" + photo.secret + "_z.jpg"; // Adress till en bild
	largeImgElem.img.src = imgUrl;
	largeImgElem.caption.innerHTML = photo.title;
	// Tillägg i lab 6:
	requestLocation(photo.id);
} // End enlargeImg

// ---------- Följande är tillägg för lab6 ----------

// Ajax-begäran av plats för bilden
function requestLocation(id) {
	let requestPos = new XMLHttpRequest(); // object för ajax anrop 
	requestPos.open("GET", "https://api.flickr.com/services/rest/?api_key=" + myApiKey + "&method=flickr.photos.geo.getLocation&photo_id=" + id + "&format=json&nojsoncallback=1", true); //begär bildens geo-location
	requestPos.send(null);
	requestPos.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
		if (requestPos.readyState == 4) // 4 = kommunikation upprättad 
			if (requestPos.status == 200) showLocation(requestPos.responseText); //200 = filen finns
			else imgLocationElem.innerHTML = "Den begärda resursen finns inte";
	};
} // End requestLocation

// Visa koordinater
function showLocation(position) {
	let latlon = JSON.parse(position); //objekt för response position för att ta fram kordinaterna för bilden 
	let coords = latlon.photo.location; // referens för positionering av bild 
	let imgLocationElem = document.getElementById("imgLocation"); // Element för positioneringen  
	imgLocationElem.innerHTML = "Latitude: " + coords.latitude + "<br>Longitude:  " + coords.longitude; // Skriver ut kordinaterna med latitiud och longitud

	requestImgsByLocation(coords.latitude, coords.longitude);
} // End showLocation

// Ajax-begäran av nya bilder
function requestImgsByLocation(lat, lon) {
	let byLock = new XMLHttpRequest(); // object för ajax begäran 
	byLock.open("GET", "https://api.flickr.com/services/rest/?api_key=" + myApiKey + "&method=flickr.photos.search&lat" + lat + "&lon" + lon + "&per_page=5&page=" + "&format=json&nojsoncallback=1" + "&has_geo=1", true);
	byLock.send(null); //begäran för 5 fler bilder med samma positionering 
	byLock.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
		if (byLock.readyState == 4) //4 = kommunikation upprättad 
			if (byLock.status == 200) showMoreImgs(byLock.responseText); //200 = filen finns
			else moreImgElem.innerHTML = "Den begärda resursen finns inte";
	}


} // End requestImgsByLocation

// Tolka svaret och visa upp bilderna.
function showMoreImgs(response) {
	response = JSON.parse(response); //ojekt med data om ajax response
	moreImgElem.innerHTML = ""; // Tom string för variablen moreImgElem
	for (let i = 0; i < response.photos.photo.length; i++) {
		let photo = response.photos.photo[i]; //ett foto i svaret 
		let imgUrl = "https://live.staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_s.jpg"; //adress till en bild 
		let newElem = document.createElement("img"); //nytt img-element 
		newElem.setAttribute("src", imgUrl); //Nytt attribut för de nya bilderna 
		newElem.setAttribute("data-photo", JSON.stringify(photo)); //spara data om fotot 
		moreImgElem.appendChild(newElem);
	} //referens för att lägga in innehållet i nya elementet
	console.log(showMoreImgs)
} // End showMoreImgs

// ---------- Karta från Google Maps ---------- Extramerit

// Skapa en karta och markeringar
function initMap(lat, lon) {

} // End initMap
