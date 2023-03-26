//Globala variabler
var msgElem; //variabel för att uppdatera innehåll i html


function init() {
    msgElem = document.getElementById("jsonfile");
    document.getElementById("jsonknapp").addEventListener("click", loadJSON); //hämta json fil kopplat till knappen med händelsehanterare 
}
window.addEventListener("load", init);

function loadJSON() {
    let request = new XMLHttpRequest();
    request.open('GET', "bali.json", true);
    request.send(null);
    request.onreadystatechange = function () { // Funktion för att avläsa status i kommunikationen
        if (request.readyState == 4) //om 4 = kommunikation upprättad
            if (request.status == 200) //om 200 = filen finns
                getCountry(request.responseText);
            else
                document.getElementById("result").innerHTML = "den begärda resursen fanns inte";
    };
}

function getCountry(JSONtext) { //funktion för att tolka innehållet i json
    let countries = JSON.parse(JSONtext).destination_object.destination;
    let HTMLcode = "";
    for (let i = 0; i < countries.length; i++) {
        let destination = countries[i];

        HTMLcode += "<h2>" + destination.name + "</h2>"; //skriver ut innehållet från json
        HTMLcode += "<h3>" + destination.cost + "</h3>"; // Skriver ut innehållet från json
        HTMLcode += "<p>" + destination.todo + "</p>"; //skriver ut innehållet från json
        HTMLcode += "<p>" + destination.food + "</p>"; //skriver ut innehållet från json

        HTMLcode += "<a href=" + destination.link.url + "> Länk </a>"; //skriver ut länken



    }

    msgElem.innerHTML = HTMLcode;
}
