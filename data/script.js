//home;man;woman;news;contacts
let links =[
  "https://github.com/FatalErrror/trandyHall/raw/master/data/main1.jpg", 
  "",
  "https://github.com/FatalErrror/trandyHall/raw/master/data/main.jpg",
  "https://github.com/FatalErrror/trandyHall/raw/master/data/home.png",
  ""
]

let button = document.querySelector('.button');
let image = document.querySelector('.image');

for(let i = 0; i < button.length; i = i + 1){
  button[i].addEventListener('click', function () {
    image.src = links[i];
});
}