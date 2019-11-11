var a  = document.querySelector("#form-container a");
var copiedNotif = document.querySelector("#copied-notif");

a.addEventListener("click", function(){
	//Create temporary input element to append text to copy 
	var inputElement = document.createElement("input");
	inputElement.type = "text";
	inputElement.value = a.innerHTML;
	document.body.appendChild(inputElement);
	
	//select and copy text from temporary input element
	inputElement.select();
	document.execCommand("Copy");
	
	//remove temporary input element
	document.body.removeChild(inputElement);
	
	//Display copied to clipboard notification
	copiedNotif.style.display = "inline";
});

 

