// Globala variabler
var linkListElem;	// Referens till div-elementet för länkarna
var courseListElem;	// Referens till div-element där valda kurser ska läggas.

// Initiering av globala variabler och händelsehanterare.
function init() {
	linkListElem = document.getElementById("linkList");
	document.getElementById("linkBtn").addEventListener("click", listLinks);

	// Array med referenser till alla li-element i den andra section
	let courseElems = document.querySelectorAll("main section:nth-of-type(2) div:first-of-type li");
	for (let i = 0; i < courseElems.length; i++) {
		courseElems[i].addEventListener("click", addCourse);
		courseElems[i].style.cursor = "pointer";
	}
	courseListElem = document.getElementById("courseList");

	document.getElementById("teacherBtn").addEventListener("click", addTeachers); // Används i extramerit
} // End init
window.addEventListener("load", init); // init aktiveras då sidan är inladdad
// ---------------------------------------------------------------
// Kopiera alla länkar ur huvudtexten och lägg upp dem i en lista.
function listLinks() {
	linkListElem.innerHTML = ""; //tom array för linklist, tömmer innehållet 
	let Elems = document.querySelectorAll("section:nth-of-type(1) div a"); //referns till länkarna 
	for (let i = 0; i < Elems.length; i++) {  //loopar igenom länkarna 
		let course = document.createElement("p"); //nytt p element 
		linkListElem.appendChild(course); // koppla p-element till linklistelem
		let cloneNode = Elems[i];
		let cloneCourse = cloneNode.cloneNode(true); //klonar kurslänkarna 
		course.appendChild(cloneCourse); //koppla clonecourse till nya elementet som skapades 
	}


} // End listLinks
// ---------------------------------------------------------------
// Den kurs användaren klickat på, läggs in överst i kurslistan.
function addCourse() {
	let newCourse = this.innerHTML; // deklaration av ny variabel som väljs
	let checkCourse = document.querySelectorAll("main section:nth-of-type(2) div:nth-of-type(2) p")
	for (let i = 0; i < checkCourse.length; i++) {
		if (checkCourse[i].innerHTML == newCourse) { //kontrollerar om element redan finns i listan
			return;
		}
	}
	let list1Elem = document.querySelector("main section:nth-of-type(2) div:nth-of-type(2) p") //referens till existerande p-element 
	let newElem = document.createElement("p"); // nytt p-element 
	courseListElem.parentNode.insertBefore(newElem, list1Elem); // Lägga till p-element sist i listan
	let newText = document.createTextNode(this.innerHTML); // Skapar en ny textnod med innehållet av valt p element 
	newElem.appendChild(newText); // Kopplar ihop till nya p-elementet 

	newElem.style.cursor = "pointer"; //ändra stil på musen 

	newElem.addEventListener("click", removeCourse); // händelsehanterare för att ta bort kurs

} // End addCourse

// Den kurs användaren klickat på i kurslistan, tas bort.
function removeCourse() { //funktion för att ta bort kurs
	this.parentNode.removeChild(this); // Tar bort valda kursen  
} // End removeCourse
// ---------------------------------------------------------------

