// Globala variabler
var subjectInfoElem, courseListElem;	// Referenser till div-elementen för indata
// Inga andra globala variabler får införas i programmet!

// Initiering av globala variabler och händelsehanterare
function init() {
	subjectInfoElem = document.getElementById("subjectInfo");
	courseListElem = document.getElementById("courseList");
	document.getElementById("subjectMenu1").addEventListener("change", selectSubject);
	document.getElementById("subjectMenu2").addEventListener("change", selectCourses);
} // End init
window.addEventListener("load", init); // init aktiveras då sidan är inladdad

// ----- Meny 1 -----

// Avläs menyn för val av ämne
function selectSubject() {
	let subject = this.options[this.selectedIndex].innerHTML; //referens till text innehåll i elementet 
	this.selectedIndex = 0; //returnera index till första valet
	let request = new XMLHttpRequest(); // referens till ny xml begäran 
	request.open("GET", "XML/subjects.xml", true); //referns till xml filerna 
	request.send(null);
	request.onreadystatechange = function () {
		if (request.readyState == 4)
			if (request.status == 200) { //om ready status är 4 är kommunikationen upprättat. Om request status är 200 finns filen
				getData(request.responseXML, subject);


			}

	};
}// End selectSubject

function getData(XMLcode, subject) {
	let resElem = ""; // definierar resElem resultatet som tom array
	let subjectElems = XMLcode.getElementsByTagName("subject");
	let noInfo = XMLcode.getElementsByTagName("not_awailable")[0].firstChild.data;
	for (let i = 0; i < subjectElems.length; i++) { //loopar genom subject element, får innehållet av namn och info element 
		let titleElem = subjectElems[i].getElementsByTagName("name")[0].firstChild.data;
		let infoElem = subjectElems[i].getElementsByTagName("info")[0].firstChild.data;

		if (subject == titleElem) { //jämför om namn elementet stämmer med subject
			resElem = "<h3>" + titleElem + "</h3>";
			resElem += "<p>" + infoElem + "<p>";

		}


	}
	if (resElem == "") { //om resElem elementet är tomt, returnernas not available 
		resElem = noInfo;

	}
	subjectInfoElem.innerHTML = resElem; //refererar till text element i html koden. 
} // End getData

// ----- Meny 2 -----

// Avläs menyn för val av ämne för kurser
function selectCourses() {
	let course = this.selectedIndex;
	requestData(course);
	this.selectedIndex = 0;

}
// End selectCourses

//tillkallar xml inhållet baserat på olika filer
function requestData(filename) {
	let request = new XMLHttpRequest();
	request.open("GET", "xml/courselist" + filename + ".xml", true); //tillkallar fil nummret 
	request.send(null);
	request.onreadystatechange = function () {
		if (request.readyState == 4)
			if (request.status == 200) getInfo(request.responseXML); //om 200 så finns filen, tillkallar då getinfo funktionen
			else courseListElem = "404 error not found";
	}
}
//end request data

//tillkallar XML innehåll baserat på olika val
function getInfo(XMLcode) {
	let subjectElemsSecond = XMLcode.getElementsByTagName("subject")[0];
	let courseElems = XMLcode.getElementsByTagName("course");
	let resElem = ""

	resElem += "<h3>" + subjectElemsSecond.firstChild.data + "</h3>"; //avläsar inhållet av xml subject

	for (let i = 0; i < courseElems.length; i++) { //loopar igenom courseElems 
		let code = courseElems[i].getElementsByTagName("code")[0];
		let title = courseElems[i].getElementsByTagName("title")[0];
		let credit = courseElems[i].getElementsByTagName("credits")[0];
		//avläsar innehållet av code, title och credit elementen. 
		resElem += "<p>" + code.firstChild.data + ", " + title.firstChild.data + ", " + credit.firstChild.data + "hp</p>";

	}
	courseListElem.innerHTML = resElem; //tolkar resultat elementen till HTML
}
//end getInfo




