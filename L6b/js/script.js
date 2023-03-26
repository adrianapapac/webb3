// Globala variabler
var myMap;				// Objekt för kartan
var myMarkers = [];		// Array med markeringar
var userMarker;			// Objekt för markering där användaren klickar
const markerData = [	// Data för markeringar som hör till knapparna
	{ position: { lat: 55.67550668328013, lng: 12.562923245877867 }, title: "köpenhamn" },
	{ position: { lat: 55.605655262976654, lng: 13.00635775129477 }, title: "malmö" },
	{ position: { lat: 55.40405598715669, lng: 10.4019328796716 }, title: "odense" },
	{ position: { lat: 57.71022092099755, lng: 11.978956996409103 }, title: "göteborg" },
	{ position: { lat: 59.330620329228054, lng: 18.07268389668386 }, title: "stockholm" }
];
var mapLocationElem;			// Element för utskrift av koordinater
var myApiKey = "c9c4bf633fce8bffb4de0c1e81e5085d";	// Ersätt DIN-API-KEY med din egen Flickr API key
var flickrImgElem;				// Referens till element där bilderna ska visas

// Initiering av programmet
function init() {
	initMap();
	mapLocationElem = document.getElementById("mapLocation"); //referns till elementet maplocation i html
	flickrImgElem = document.getElementById("flickrImg");
	let nameButtons = document.querySelectorAll("button"); //referens till div-elementet i html för knappar 
	for (let i = 0; i < markerData.length; i++) {
		nameButtons[i].innerHTML = markerData[i].title;
		nameButtons[i].setAttribute("data-ix", i);
		nameButtons[i].addEventListener("click", showAddrMarker);
	}   //loopar igenom markers för att ta fram markeringar för vald position
} // End init
window.addEventListener("load", init);

// -----------------------------------------------------------------------------------------

// Skapa en karta och markeringar
function initMap() {
	myMap = new google.maps.Map(
		document.getElementById('map'),
		{
			center: { lat: 55.67550668328013, lng: 12.562923245877867 },
			zoom: 4,
			styles: [
				{ featureType: "poi", stylers: [{ visibility: "off" }] },  // No points of interest.
				{ featureType: "transit.station", stylers: [{ visibility: "off" }] }  // No bus stations, etc.
			]
		} //För att kartan ska vara centrerad utifrån huvudpositionenen när sidan laddas in. 
	);
	for (let i = 0; i < markerData.length; i++) {
		let newMarker = new google.maps.Marker(markerData[i]); // Objekt för markering
		myMarkers.push(newMarker); //loop för att ta fram de nya markeringarna 
	}
	userMarker = null;
	google.maps.event.addListener(myMap, "click", newUserMarker); //händelsehanterare för att ta fram nya markeringar 
} // End initMap

// Sätt markerns position till var användaren klickade och lägg in markern på kartan.
function newUserMarker(e) {
	hideMarkers(); // Gömma markeringar vid start samt ändring av position
	userMarker = new google.maps.Marker(); // Ta fram markering på kartan
	userMarker.setPosition(e.latLng); // Fästa markering utifrån lat och long 
	userMarker.setMap(myMap); // Lägger till markers på karta
	mapLocationElem.innerHTML = "Latitud: " + e.latLng.lat() + " och Longtitud: " + e.latLng.lng(); // Skriver ut koordinaterna 
} // End newUserMarker

// Visa marker för den adressknapp som användaren klickat på
function showAddrMarker() {
	hideMarkers();
	myMarkers[this.getAttribute("data-ix")].setMap(myMap); // Hämtar data med data-ix för att positioner ska tas fram med händelsehanterare
} // End showAddrMarker

// Dölj alla markeringar
function hideMarkers() {
	for (let i = 0; i < myMarkers.length; i++) {
		myMarkers[i].setMap(null);
	} //loop för att dölja markeringar
	if (userMarker) userMarker.setMap(null);
} // End hideMarkers

// ----- Foton från Flickr ----- Extramerit

// Ajax-begäran av nya bilder
function requestImgsByLocation(lat, lon) {

} // End requestImgsByLocation

// Tolka svaret och visa upp bilderna.
function showMoreImgs(response) {

} // End showMoreImgs
