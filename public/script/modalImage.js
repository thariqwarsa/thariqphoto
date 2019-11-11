// MODAL IMAGE SCRIPT

var modal 		= document.getElementById("myModal");
var img 		= document.querySelectorAll(".index-image");
var modalImg 	= document.getElementById("modalImg");
var captionText = document.getElementById("caption");
var imgBtn		= document.querySelectorAll(".imgBtn");
var imgContainer= document.querySelectorAll(".imgContainer");
var body		= document.querySelector("body");

img.forEach(function(image){
	image.addEventListener("click", function(){
		modal.style.display = "block";
    	modalImg.src = this.src;
    	captionText.innerHTML = this.alt;
	});
});

imgContainer.forEach(function(imgCont, i){
	imgCont.addEventListener("mouseenter", function(){
		imgBtn[i].style.display = "block";
	});
	imgCont.addEventListener("mouseleave", function(){
		imgBtn[i].style.display = "none";
	});
});

var close = document.getElementsByClassName("close")[0];

close.onclick = function() {
 	modal.style.display = "none";
} 

