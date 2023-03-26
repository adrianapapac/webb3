//Globala variabler
var msgElem;


function init() {
    msgElem = document.getElementById("jsonfile");
    document.getElementById("jsonknapp").addEventListener("click", loadJSON);
}
window.addEventListener("load", init);

function loadJSON() {
    console.log("test")
    let request = new XMLHttpRequest();
    request.open('GET', "bali.json", true);
    request.send(null);
    request.onreadystatechange = function () {
        if (request.readyState == 4)
            if (request.status == 200)
                getCountry(request.responseText);
            else
                document.getElementById("result").innerHTML = "den begärda resursen fanns inte";
    };
}

function getCountry(JSONtext) {
    let countries = JSON.parse(JSONtext).destination
    let HTMLcode = "";
    for (let i = 0; i < countries.length; i++) {
        let destination = countries[i];

        HTMLcode += "<h2>" + destination.name + "</h2>";
        HTMLcode += "<h3>" + destination.cost + "</h3>";
        HTMLcode += "<p>" + destination.todo + "</p>";
        HTMLcode += "<p>" + destination.food + "</p>";

        HTMLcode += "<a href src=" + destination.link.url + "> Länk </a>";
    }

    msgElem.innerHTML = HTMLcode;
}
