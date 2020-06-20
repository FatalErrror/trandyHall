const http = require('http');
const fs = require('fs');
const path = require('path');


var os = require('os');
var ifaces = os.networkInterfaces();

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      console.log(ifname + ':' + alias, iface.address);
    } else {
      // this interface has only one ipv4 adress
      console.log(ifname, iface.address);
    }
    ++alias;
  });
});

var port = 5555;




http.createServer((request,response) => {
  try{
    function requestfile(filepath, errcallback, succescallback) {
      fs.readFile(path.join(__dirname+'/data',filepath), (err, data) => {
        if (err) {
          errcallback(err);
        }
        else {
		
          succescallback(data);
        }
      });
    }

    function err404(err) {
	  console.log(err);
      response.statusCode = 404;
      response.setHeader('Content-Type', 'text/html');
      response.end(
        '<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>Page Not Found</title><meta name="viewport" content="width=device-width, initial-scale=1"><style>* {line-height: 1.2;margin: 0;}html {color: #888;display: table;font-family: sans-serif;height: 100%;text-align: center;width: 100%;}'+
        'body {display: table-cell;vertical-align: middle;margin: 2em auto;}h1 {color: #555;font-size: 2em;font-weight: 400;}p {margin: 0 auto;width: 280px;}@media only screen and (max-width: 280px) {body,p {width: 95%;}h1 {font-size: 1.5em;margin: 0 0 0.3em;}}'+
        '</style></head><body><h1>Страница не найдена</h1><p>К сожелению страница к которой вы пытаетесь получить доступ не существует.</p><p>Вернитесь <a href="/">на главную</a></p></body></html>'
      );
    }

    function pasteinmain(data1) {
      requestfile('main.html', err404, (data) => {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/html');
        response.end(data.toString().replace("{content}", data1));
      });
    }

    function home(){
      requestfile('home.html', err404, pasteinmain);
    }

    function item(par) {
      requestfile('/item.html', err404, (data) => {
        let page = data.toString().replace("{image}", par);
        pasteinmain(page);
      });
    }

  console.log('Url: ' + request.url);// /jlhfvov/hgckg.img?jhgj=2&kfnjkn=kjfgnb
  let defaultquery = true;
  let querys = request.url.split('?')// [/jlhfvov/hgckg.img , jhgj=2&kfnjkn=kjfgnb]
  if (querys.length > 1){

    let squerys = querys[1].split('&');// [jhgj=2 , kfnjkn=kjfgnb]
    console.log('');
    console.log('Параметры:');
    console.log(squerys);
    console.log('');
    for (let i = 0;i < squerys.length;i++){
      let query = squerys[i].split('=');
      console.log(query);
      if (query[0] == 'itemimg'){
        defaultquery = false;
        item(query[1]);
        break;
      }
    }
    console.log('');
    console.log('');

  }

  let url = querys[0];// /jlhfvov/hgckg.img
  let surl = url.split('/');// [ , jlhfvov , hgckg.img]
  let ssurl = surl[surl.length-1].split('.');// [hgckg , img]
  let fyletype = 'html';

  console.log(url);// /jlhfvov/hgckg.img
  console.log(surl);// [ , jlhfvov , hgckg.img]
  console.log(ssurl);// [hgckg , img]

  
  if (defaultquery){
    if (ssurl.length > 1) {
      fyletype = ssurl[1];
      requestfile(url, err404,(data) => {
          response.statusCode = 200;
          //switch (request.url)
          response.setHeader('Content-Type', 'text/'+fyletype);
          response.end(data);
        });
    }
    else
    {
      if (url == '/'){
        home();
      }
      else{
        requestfile(url+'.html', err404, pasteinmain);
      }
    }
    console.log(fyletype);
  }
}catch (e) {
    console.log(e);
  }
}).listen(port,() => {console.log('Сервер начал прослушивание запросов на порту '+port);});

