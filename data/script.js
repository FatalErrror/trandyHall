//home;man;woman;news;contacts
let links =[
  "https://github.com/FatalErrror/trandyHall/raw/master/data/main1.jpg", 
  "https://github.com/FatalErrror/trandyHall/raw/master/data/%D1%8C%D1%84%D1%82.png",
  "http://7sp.ru/files/6bf/6bfcaa268556de3f2228104cd13a6d48-fit-400x400.jpg",
  "https://github.com/FatalErrror/Server/raw/master/Task.png",
  "https://github.com/FatalErrror/Server/raw/master/NewMap.png"
]

var button = document.getElementsByTagName('button');
let content = document.querySelector('.contentimage');
console.log(button);
// при клике по кнопке скрипт начинает выбирать

for(let i = 0; i < button.length; i = i + 1){
  button[i].onclick = function() {
    content.src = links[i];
  };
}
console.log(button);



