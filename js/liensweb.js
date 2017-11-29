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

// Function to create the form and add to the DOM
function createForm(){
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
	
	return form;
}

// Displays the form and handles his submission
function displayForm(){	
	
	// Create the form
	var form = createForm();
	
	// Adds the event to list for form submission and calls the function to add the link to the DOM
	form.addEventListener("submit", function(e){
		e.preventDefault();
		var link = getLink();
		if(link.url===null){
			var message = "Le lien \""+ link.titre + "\" n'est pas valide.";
			displayMessage(message, "#e60000", "#ff9999");
			createAddLinkButton();
			return;
		}
		var posted = postLink(link, postAPIUrl);
		if(posted === false){
			var message = "Erreur Reseau avec le serveur.";
			displayMessage(message, "#e60000", "#ff9999");
			createAddLinkButton();
			return;
		}
		
		addLinkToDom(link);
	
		var message = "Le lien \""+ link.titre + "\" a bien été ajouté.";
		displayMessage(message, "#0077e6", "#cce6ff");
		createAddLinkButton();
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

// Displays a message on screen
function displayMessage(message, textColor, backgroundColor){
	var messageElt = document.getElementById("successMessage");
	messageElt.textContent = message ;
	messageElt.style.padding = "20px";
	messageElt.style.color = textColor;
	messageElt.style.backgroundColor = backgroundColor;
	messageElt.style.borderRadius = "10px";
	
	
	setTimeout(function(){
		messageElt.textContent = "";
		messageElt.removeAttribute("style");
	},2000);
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