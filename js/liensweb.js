/* 
Activité 1
*/

// Liste des liens Web à afficher. Un lien est défini par :
// - son titre
// - son URL
// - son auteur (la personne qui l'a publié)
var listeLiens = [
    {
        titre: "So Foot",
        url: "http://sofoot.com",
        auteur: "yann.usaille"
    },
    {
        titre: "Guide d'autodéfense numérique",
        url: "http://guide.boum.org",
        auteur: "paulochon"
    },
    {
        titre: "L'encyclopédie en ligne Wikipedia",
        url: "http://Wikipedia.org",
        auteur: "annie.zette"
    }
];

// TODO : compléter ce fichier pour ajouter les liens à la page web

// Function that takes an object lien and add it to the DOM
function addLinkToDom(lien){
	//Create a title element which will contain the title, the link and the author
	var entryElt = document.createElement("h2");

	//Create a link for the main title
	var titleElt = document.createElement("a")
	titleElt.href = lien.url;
	titleElt.textContent = lien.titre;
	titleElt.setAttribute("target", "_blank");

	//Create a span element to put the url in
	var lienElt = document.createElement("span");
	lienElt.textContent = lien.url;
	lienElt.classList.add("lien");

	//Create a span element for the author 
	var authorElt = document.createElement("span");
	authorElt.textContent = "Ajouté par " + lien.auteur;

	//Edit the syle
	entryElt.style.backgroundColor = "white";
	entryElt.style.padding = "10px";
	entryElt.style.borderRadius = "10px";
	titleElt.style.textDecoration = "none";
	titleElt.style.color = "#428bca";
	

	//Append all the children nodes
	entryElt.appendChild(titleElt);
	entryElt.appendChild(lienElt);
	entryElt.appendChild(document.createElement("br"));
	entryElt.appendChild(authorElt);
	
	var contenu = document.getElementById("contenu");
	contenu.insertBefore(entryElt, contenu.childNodes[0]);
	//contenu.appendChild(entryElt);
}

// Function that initialises the page with the links in the array listeLiens
function initialisePage(url){
	ajaxGet(url, function(responseText){
		listeLiens = JSON.parse(responseText);
		for(var i=listeLiens.length -1; i >=0 ; i--){
			addLinkToDom(listeLiens[i]);
		}
		/*listeLiens.forEach(function (lien){
			addLinkToDom(lien)		
		});*/
	});
}

// Function tha clears the <div> of the page that has the form for user input
function clearFormSection(){
	var formSectionElt = document.getElementById("formSection");
	formSectionElt.innerHTML = "";
}

// Fuction that adds elements to the <div> of the page with the form for user input
function addToFormSection(elt){
	var formSectionElt = document.getElementById("formSection");
	formSectionElt.appendChild(elt);
}

// Add to the DOM and Displays the form for user input
function displayForm(){	
	var form = document.createElement("form");
	
	var usernameElt = document.createElement("input");
	usernameElt.setAttribute("type", "text");
	usernameElt.setAttribute("name","username");
	usernameElt.setAttribute("id", "username");
	usernameElt.setAttribute("placeholder", "Your name");
	
	var linkNameElt = document.createElement("input");
	linkNameElt.setAttribute("type", "text");
	linkNameElt.setAttribute("name","linkName");
	linkNameElt.setAttribute("id", "linkName");
	linkNameElt.setAttribute("placeholder", "Link title");
	
	var urlElt = document.createElement("input");
	urlElt.setAttribute("type", "text");
	urlElt.setAttribute("name","url");
	urlElt.setAttribute("id", "url");
	urlElt.setAttribute("placeholder", "Link url");
	urlElt.required = true;
	
	var submitElt = document.createElement("input");
	submitElt.setAttribute("type", "submit");
	submitElt.setAttribute("value", "Store");
	
	form.appendChild(usernameElt);
	form.appendChild(linkNameElt);
	form.appendChild(urlElt);
	form.appendChild(submitElt);
	
	addToFormSection(form);
	
	// Adds the event to list for form submission and calls the function to add the link to the DOM
	form.addEventListener("submit", function(e){
		e.preventDefault();
		var link = getLink();
		if(link.url===null){
			displayErrorMessage(form.elements.url.value);
			return;
		}
		var posted = postLink(link, postAPIUrl);
		if(posted === false){
			displayServerErrorMessage();
			return;
		}
		
		addLinkToDom(link);
	
		displaySuccessMessage(link.titre);
		console.log(link.titre);
	});
}

// Fetches the link from the user input
function getLink(){
	var form = document.querySelector("form");
	var username = form.elements.username.value;
	var linkName = form.elements.linkName.value;
	var url = form.elements.url.value;
	
	url = checkURL(url);
	
	var link = {
		titre: linkName,
        url: url,
        auteur: username
	};
	
	return link;	
}

// Posts the link on the web server and adds it on the DOM
function postLink(link, APIUrl){
	ajaxPost(APIUrl, link, function(responseText){
		console.log(responseText);
		if(responseText === null){
			return false;
		}
		return true;
	}, true);
}

// Displays the success message when the link is successfully added to the DOM
function displaySuccessMessage(linkName){
	var messageElt = document.getElementById("successMessage");
	messageElt.textContent = "Le lien \""+ linkName + "\" a bien été ajouté.";
	messageElt.style.padding = "20px";
	messageElt.style.color = "#0077e6";
	messageElt.style.backgroundColor = "#cce6ff"
	messageElt.style.borderRadius = "10px";
	
	
	setTimeout(function(){
		messageElt.textContent = "";
		messageElt.removeAttribute("style");
	},2000);
	
	
	createAddLinkButton();
}

// Displays the error message when the link is not valid
function displayErrorMessage(linkName){
	var messageElt = document.getElementById("successMessage");
	messageElt.textContent = "Le lien \""+ linkName + "\" n'est pas valide.";
	messageElt.style.padding = "20px";
	messageElt.style.color = "#e60000";
	messageElt.style.backgroundColor = "#ff9999"
	messageElt.style.borderRadius = "10px";
	
	
	setTimeout(function(){
		messageElt.textContent = "";
		messageElt.removeAttribute("style");
	},2000);
	
	
	createAddLinkButton();
}

// Displays the error message when the server is down
function displayServerErrorMessage(){
	var messageElt = document.getElementById("successMessage");
	messageElt.textContent = "Erreur Reseau avec le serveur" ;
	messageElt.style.padding = "20px";
	messageElt.style.color = "#e60000";
	messageElt.style.backgroundColor = "#ff9999"
	messageElt.style.borderRadius = "10px";
	
	
	setTimeout(function(){
		messageElt.textContent = "";
		messageElt.removeAttribute("style");
	},2000);
	
	
	createAddLinkButton();
}

// Creates the button for adding a link
function createAddLinkButton(){
	var addLinkButton = document.createElement("button");
	addLinkButton.id = "addLinkButton";
	addLinkButton.textContent = "Store a link";
	
	clearFormSection();
	addToFormSection(addLinkButton);
	
	addLinkButton.addEventListener("click", function(e){
		clearFormSection();
		displayForm();	
	});
}

// Checks if the URL entered by the user is valid
function checkURL(url){
	var httpUrlRegexp = new RegExp(/http(s)?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);
	var urlRegexp = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);
	
	if(!url.match(urlRegexp)){
		return null;
	}
	
	if(!url.match(httpUrlRegexp)){
		return "http://"+url;
	}
	
	return url;
}

/*------------------------Main Script----------------------*/

var getAPIUrl = "https://oc-jswebsrv.herokuapp.com/api/liens";
var postAPIUrl = "https://oc-jswebsrv.herokuapp.com/api/lien";

initialisePage(getAPIUrl);

var addLinkButton = document.getElementById("addLinkButton");
addLinkButton.addEventListener("click", function(e){
	clearFormSection();
	displayForm();	
});