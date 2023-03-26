// Initiering av globala variabler och händelsehanterare
function init() {
	let ImgView = new ImageViewer("imgViewer");

	document.querySelector("#categoryMenu").addEventListener("change", function () { //referens för att hämta bilderna ur xml-filerna 
		ImgView.requestImages("xml/images" + this.selectedIndex + ".xml");
		this.selectedIndex = 0;
	});
	document.querySelector("#prevBtn").addEventListener("click", function () { ImgView.prevImage(); }); //referens och händelsehanterare till föregående bild 
	document.querySelector("#nextBtn").addEventListener("click", function () { ImgView.nextImage(); }); //referns och händelsehanterare till nästa bild 
}
window.addEventListener("load", init);

// ---------------------------------------------------------------
// ----- Funktioner för bildspelet -----

function ImageViewer(id) {
	this.titleElem = document.querySelector("#" + id + " h3"); //referens till hämtning från html-kod
	this.imgElem = document.querySelector("#" + id + " img"); //referns till hämtning html-kod
	this.captionElem = document.querySelector("#" + id + " p"); //referns till hämtning html-kod
	this.imgIx = 0; //För att börja om efter sista bilden 
	this.timer = null;
	this.list = [{ url: "img/blank.png", caption: "" }]; //referns till det som ingår i listan
}

// Gör ett Ajax-anrop för att läsa in begärd fil
ImageViewer.prototype.requestImages = function (file) { // funktion för begäran av bilder från xml-filerna
	let request = new XMLHttpRequest(); // Object för Ajax-anropet
	let self = this;
	request.open("GET", file, true);
	request.send(null); // Skickar begäran till servern
	request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
		if (request.readyState == 4) // readyState 4 --> kommunikation klar
			if (request.status == 200) self.getImages(request.responseXML); // status 200 (OK) --> filen finns
			else document.getElementById("result").innerHTML = "Den begärda resursen fanns inte.";
	};
}
// End requestImages

// Funktion för att tolka XML-koden. Samt lägga in innehållet i variablerna för bilderna i bildspelet
ImageViewer.prototype.getImages = function (XMLcode) { // Funktion för att få fram bilderna ur XML-filerna efter begäran
	this.titleElem.innerHTML = XMLcode.getElementsByTagName("category")[0].firstChild.data;
	let urlElems = XMLcode.getElementsByTagName("url"); // Alla url-element från xml-filerna
	let captionElems = XMLcode.getElementsByTagName("caption"); // Alla caption-element
	this.list = []; // Nya tomma arrayer för bilder och bildtexter
	for (let i = 0; i < urlElems.length; i++) {
		this.list.push({ url: urlElems[i].firstChild.data, caption: captionElems[i].firstChild.data }); // loop för att pusha igenom bilderna och captions till listan
	}
	this.imgIx = 0;
	this.showImage();
}
// End getImages

// Visa bilden med index imgIx
ImageViewer.prototype.showImage = function () {
	this.imgElem.src = this.list[this.imgIx].url;
	this.captionElem.innerHTML = (this.imgIx + 1) + ". " + this.list[this.imgIx].caption; //visar bilderna och captions 
}
// End showImage

// Visa föregående bild
ImageViewer.prototype.prevImage = function prevImage() {
	if (this.imgIx > 0) this.imgIx--; //för att gå tillbaka till föregående bild eller sista bilden om det är första bilden i bildserien
	else this.imgIx = this.list.length - 1; // Gå runt till sista bilden
	this.showImage();
}
// End prevImage

// Visa nästa bild
ImageViewer.prototype.nextImage = function () {
	if (this.imgIx < this.list.length - 1) this.imgIx++;
	else this.imgIx = 0; // Gå runt till första bilden
	this.showImage();
}
	// End nextImage