// Initiering av globala variabler och händelsehanterare
function init() {
	let ImgView = new ImageViewer("imgViewer");

	document.querySelector("#categoryMenu").addEventListener("change", function () {  //referens för att hämta bilderna ur json-filerna 
		ImgView.requestImages("json/images" + this.selectedIndex + ".json");
	});
	document.querySelector("#prevBtn").addEventListener("click", function () { ImgView.prevImage(); }); //referens och händelsehanterare till föregående bild 
	document.querySelector("#nextBtn").addEventListener("click", function () { ImgView.nextImage(); }); //referens och händelsehanterare till nästa bild 
}
window.addEventListener("load", init);

// ---------------------------------------------------------------
// ----- Funktioner för bildspelet -----

function ImageViewer(id) {
	this.titleElem = document.querySelector("#" + id + " h3"); //referens till hämtning från html-kod
	this.imgElem = document.querySelector("#" + id + " img"); //referens till hämtning från html-kod
	this.captionElem = document.querySelector("#" + id + " p"); //referens till hämtning från html-kod
	this.imgIx = 0; //För att börja om efter sista bilden 
	this.list = [{
		"url": "img/blank.jpg",
		"caption": [""]
	}]; //referens till det som ingår i listan 
}

// Gör ett Ajax-anrop för att läsa in begärd fil
ImageViewer.prototype.requestImages = function (file) { // // funktion för begäran av bilder från xml-filerna
	let request = new XMLHttpRequest(); // Object för Ajax-anrop

	request.open("GET", file, true);
	request.send(null); // Skicka begäran till servern
	let self = this;
	request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
		if (request.readyState == 4) // readyState 4 --> kommunikationen är klar
			if (request.status == 200) self.getImages(request.responseText); // status 200 (OK) --> filen fanns
			else document.getElementById("result").innerHTML = "Den begärda resursen fanns inte.";
	};
}
// End requestImages

// Funktion för att tolka XML-koden. Samt lägga in innehållet i variablerna för bilderna i bildspelet
ImageViewer.prototype.getImages = function (JSONcode) { // Funktion för att få fram bilderna ur XML-filerna efter begäran

	let img = JSON.parse(JSONcode);
	this.titleElem.innerHTML = img.category;
	let urlCode = img.image;
	this.list = []; // Tom array för bilder och bildtexter
	for (let i = 0; i < urlCode.length; i++) {
		this.list.push({ url: urlCode[i].url, caption: urlCode[i].caption });
		console.log(urlCode)
		// loop för att pusha igenom bilderna och captions till listan
	}
	this.imgIx = 0;
	this.showImage();
}

// End getImages 

// Visa bilden med index imgIx
ImageViewer.prototype.showImage = function () { //funktion för att få fram bilderna och caption 
	this.imgElem.src = this.list[this.imgIx].url;
	this.captionElem.innerHTML = [this.imgIx + 1] + ". " + this.list[this.imgIx].caption; //visar bilderna och captions 
}
// End showImage

// Visa föregående bild
ImageViewer.prototype.prevImage = function prevImage() {
	if (this.imgIx > 0) this.imgIx--;
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