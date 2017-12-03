

// Function that takes an object lien and add it to the DOM
function addLinkToDom(lien){
	//Create a title element which will contain the title, the link and the author
	var entryElt = document.createElement("p");

	//Create a link for the main title
	var titleElt = document.createElement("a");
	titleElt.href = lien.url;
	titleElt.textContent = lien.title;
	titleElt.setAttribute("target", "_blank");

	//Create a span element to put the url in
	var lienElt = document.createElement("span");
	lienElt.textContent = lien.url;
	lienElt.classList.add("lien");

	//Create a span element for the author 
	var authorElt = document.createElement("span");
	authorElt.textContent = "stored by " + lien.author;

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
	
	var content = document.getElementById("content");
	content.insertBefore(entryElt, content.childNodes[0]);
}

// Function that initialises the page with the links in the array listeLiens
function initialisePage(url){
	ajaxGet(url, function(responseText){
		var listeLiens = JSON.parse(responseText);
		for(var i=0; i <=listeLiens.links.length -1 ; i++){
			addLinkToDom(listeLiens.links[i]);
		}
	});
}

// Fuction that adds elements to the <div> of the page with the form for user input
function addToFormSection(elt){
	var formSectionElt = document.getElementById("formSection");
	formSectionElt.appendChild(elt);
}

// Function to create the form and add to the DOM
function createForm(){
	var form = document.createElement("form");
	
	var usernameDiv = document.createElement("div");
	usernameDiv.setAttribute("class","col-lg-3 col-md-3 col-sm-3 col-xs-12");
	var usernameElt = document.createElement("input");
	usernameElt.setAttribute("type", "text");
	usernameElt.setAttribute("name","username");
	usernameElt.setAttribute("id", "username");
	usernameElt.setAttribute("placeholder", "Your name");
	usernameElt.setAttribute("class", "form-control");
	usernameDiv.appendChild(usernameElt);

	var linkNameDiv = document.createElement("div");
	linkNameDiv.setAttribute("class","col-lg-3 col-md-3 col-sm-3 col-xs-12");
	var linkNameElt = document.createElement("input");
	linkNameElt.setAttribute("type", "text");
	linkNameElt.setAttribute("name","linkName");
	linkNameElt.setAttribute("id", "linkName");
	linkNameElt.setAttribute("placeholder", "Link title");
	linkNameElt.setAttribute("class", "form-control");
	linkNameDiv.appendChild(linkNameElt);

	var urlDiv = document.createElement("div");
	urlDiv.setAttribute("class","col-lg-4 col-md-4 col-sm-4 col-xs-12");
	var urlElt = document.createElement("input");
	urlElt.setAttribute("type", "text");
	urlElt.setAttribute("name","url");
	urlElt.setAttribute("id", "url");
	urlElt.setAttribute("placeholder", "Link url");
	urlElt.required = true;
	urlElt.setAttribute("class", "form-control");
	urlDiv.appendChild(urlElt);

	var submitDiv = document.createElement("div");
	submitDiv.setAttribute("class","col-lg-2 col-md-2 col-sm-2 col-xs-12");
	var submitElt = document.createElement("input");
	submitElt.setAttribute("type", "submit");
	submitElt.setAttribute("value", "Store");
	submitElt.setAttribute("class", "btn btn-primary btn-block");
	submitDiv.appendChild(submitElt);
	
	form.appendChild(usernameDiv);
	form.appendChild(linkNameDiv);
	form.appendChild(urlDiv);
	form.appendChild(submitDiv);
	
	form.setAttribute("id", "submissionForm");
	
	addToFormSection(form);
	
	return form;
}

// Handles the form submission
function handleFormSubmission(){	
	
	
	// Adds the event to list for form submission and calls the function to add the link to the DOM
	form.addEventListener("submit", function(e){
		e.preventDefault();
		var link = getLink(form);
		var message = "";
		var alertType ="alert alert-dismissable";
		if(link.url===null){
			message = "\""+ link.title + "\" is not a valid url.";
			alertType += " alert-warning";
			displayMessage(message, alertType);
			return;
		}
		
		var posted = postLink(link, postAPIUrl);
		
		if(posted === false){
			message = "Server not responding.";
			alertType += " alert-danger";
			displayMessage(message, alertType);
			return;
		}
		
		addLinkToDom(link);
	
		message = "\""+ link.title + "\" has been added.";
		alertType += " alert-success";
		displayMessage(message, alertType);
		$("#submissionForm").hide();
		$("#addLinkButton").show();
	});
}

// Fetches the link from the user input
function getLink(form){
	var username = form.elements.username.value;
	var linkName = form.elements.linkName.value;
	var url = form.elements.url.value;
	
	url = checkURL(url);
	
	var link = {
		title: linkName,
        url: url,
        author: username
	};
	
	return link;	
}

// Posts the link on the web server and adds it on the DOM
function postLink(link, APIUrl){
	ajaxPost(APIUrl, link, function(responseText){
		if(responseText === null){
			return false;
		}
		return true;
	}, true);
}

// Displays a message on screen
function displayMessage(message, alertType){
	if(!$("#message").length){
		var defaultMessageElt = document.createElement("h2");
		defaultMessageElt.id="message";
		var messageSectionElt = document.getElementById("messageSection");
		messageSectionElt.appendChild(defaultMessageElt);
	}
	$("#message").fadeIn();
	var messageElt = document.getElementById("message");
	messageElt.textContent = message ;
	messageElt.setAttribute("class", alertType);
	var closeButton = document.createElement("button");
	closeButton.setAttribute("type", "button");
	closeButton.setAttribute("class", "close");
	closeButton.setAttribute("data-dismiss","alert");
	closeButton.textContent = "×";
	messageElt.appendChild(closeButton);
	
	
	setTimeout(function(){
		$("#message").fadeOut();
	}, 2000);
	
	
}


// Checks if the URL entered by the user is valid
function checkURL(url){
	var httpUrlRegexp = new RegExp(/http(s)?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_.~#?&//=]*)/);
	var urlRegexp = new RegExp(/[-a-zA-Z0-9@:%._~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_.~#?&//=]*)/);
	
	if(!url.match(urlRegexp)){
		return null;
	}
	
	if(!url.match(httpUrlRegexp)){
		return "http://"+url;
	}
	
	return url;
}

/*------------------------Main Script----------------------*/

var getAPIUrl = "http://localhost:3000/api/links";
var postAPIUrl = "http://localhost:3000/api/links";

initialisePage(getAPIUrl);
var form = createForm();
$("#submissionForm").hide();

var addLinkButton = document.getElementById("addLinkButton");
addLinkButton.addEventListener("click", function(){
	$("#addLinkButton").hide();
	$("#submissionForm").show();
	handleFormSubmission();
});