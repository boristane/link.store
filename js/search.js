function download(text, name, type) {
    var a = document.createElement("a");
    var file = new Blob([text], {type: type});
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();
}

// Fetch all the links
var getAPIUrl = "http://localhost:3000/api/links";


var searchForm = document.getElementById("search-bar");
var userInput = "";

searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var links = [];
    var result = [];
    
    document.getElementById("content").innerHTML = "";
    
    ajaxGet(getAPIUrl, function(responseText){
        var listeLiens = JSON.parse(responseText);
        for(var i=0; i <=listeLiens.links.length -1 ; i++){
            links.push(listeLiens.links[i]);
        }
    });
    
    $.ajax(getAPIUrl).done(function(){
        
        userInput = searchForm.elements.search.value;
    
        for(var i = 0; i < links.length; i++) {
            
            if (links[i].author.indexOf(userInput) !== -1) {
                result.push(links[i]);
                addLinkToDom(result[result.length-1]);
                continue;
            }
    
            if (links[i].title.indexOf(userInput) !== -1) {
                result.push(links[i]);
                addLinkToDom(result[result.length-1]);
                continue;
            }
    
            if (links[i].url.indexOf(userInput) !== -1) {
                result.push(links[i]);
                addLinkToDom(result[result.length-1]);
                continue;
            }
        }
    });   
});