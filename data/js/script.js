//home;man;woman;news;contacts
let links =[
  "/home",
  "/man",
  "/woman",
  "/news",
  "/contacts"
]

let button = document.querySelectorAll('.button');

let content = document.querySelector('.content');
//let div = document.createElement('div');
//div.className = "alert";
//req(0);

function req(urlindex) {
	console.log(urlindex);
	console.log(links[urlindex]);
  let request = new XMLHttpRequest();
  request.open('GET', links[urlindex]);
  request.responseType = 'text';
  request.onload = function() {
    //smoothly(content, 'innerHTML', request.response);
	content.innerHTML = request.response;
  }
  request.send();
}

//content.appendChild(div);
for(let i = 0; i < button.length; i = i + 1){
  button[i].onclick = function() {
	//content.innerHTML = "<img class='contentimage' alt='loading' src='/img/loading.gif'>";
	console.log(i);
    //req(i);
  };
  if (document.location == button[i].href){
	  button[i].style.cssText = 'color: red;';
  }
}