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

let database;

function getdatabase() {
  fs.readFile(path.join(__dirname,'data/data/database.txt'), (err, data) => {
    if (err) {
      console.log(err);
    }
    else {
      database = data.toString().split('\n');
    }
  });
}

getdatabase();

http.createServer((request,response) => {
  try{
    //=====проверка надоли обновлять базу данных========
    fs.readFile(path.join(__dirname,'data/data/needupdatedatabase.txt'), (err, data) => {
      if (err) {
        console.log(err);
      }
      else {
        if (data.toString() == '1') {
          fs.writeFile(path.join(__dirname,'data/data/needupdatedatabase.txt'), '0', (err1) => {console.log(err1)});
          getdatabase();
        }
      }
    });

    //============описание необходимых функций================

    function rewritefile(filepath, errcallback, data) {
      fs.writeFile(path.join(__dirname+'/data',filepath), data, errcallback);
    }

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

    function getinformationwithid(id) {
      return database[id].split('|');
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
	
	function getdatabaseparamvalue(id, key) {
	  let line = getinformationwithid(id)[3];
      if (line.length > 2){//если есть параметры
        let params = line.split('&');// [jhgj=2 , kfnjkn=kjfgnb]
        for (let i = 0;i < params.length;i++){
          let param = params[i].split('=');
          if (param[0] == key) return param[1];
        }
        return undefined;
      }
      else return undefined;
    }

    function getparamvalue(key) {
      if (querys.length > 1){//если есть параметры
        let params = querys[1].split('&');// [jhgj=2 , kfnjkn=kjfgnb]
        for (let i = 0;i < params.length;i++){
          let param = params[i].split('=');
          if (param[0] == key) return param[1];
        }
        return undefined;
      }
      else return undefined;
    }

    //========================разделение запроса=================
	console.log('=====================================');
    console.log('request: ' + request.url);// /jlhfvov/hgckg.img?jhgj=2&kfnjkn=kjfgnb
    let querys = request.url.split('?')// [/jlhfvov/hgckg.img , jhgj=2&kfnjkn=kjfgnb]
    let url = querys[0];// /jlhfvov/hgckg.img
    let surl = url.split('/');// [ , jlhfvov , hgckg.img]
    let ssurl = surl[surl.length-1].split('.');// [hgckg , img]
    let fyletype = 'html';

    console.log('url: ' + url);// /jlhfvov/hgckg.img
    console.log('surl: ' + surl);// [ , jlhfvov , hgckg.img]
    console.log('ssurl: ' + ssurl);// [hgckg , img]

    //==============варианты запросов=========
    function home(){
     requestfile('home.html', err404, pasteinmain);
    }

    function list() {
     let values = [0]; //values - массив id
     //TODO: сделать быборку по тегам
      //============ выборка по тегам=====
	  param = getparamvalue('gender');
	  param1 = getparamvalue('neworsale');
	  for (let i = 0;i < database.length;i++){
		 if (getdatabaseparamvalue(i, 'gender') == param) {
			 if (getdatabaseparamvalue(i, 'neworsale') == param1) {
			   values[values.length] = i;
			 }
		 }
	  }
	  
      //==================================
     requestfile('/list.html', err404, (data) => {
       let listpage = data.toString();
       requestfile('/card.html', err404, (data1) => {
         let listcontent = '';
         let cardpage = data1.toString();
         for (let i = 1;i < values.length;i++){
           let information = getinformationwithid(values[i]);
           let card = cardpage.replace('{id}',information[0]);
           card = card.replace('{src}',information[6]);
           card = card.replace('{name}',information[1]);
           card = card.replace('{description}',information[2]);
           card = card.replace('{value}',information[4]);
           listcontent = listcontent+'\n'+card;
         }
         pasteinmain(listpage.replace("{listcontent}",listcontent));
       });
     });
    }

    function item() {
     requestfile('/item.html', err404, (data) => {
       let id = getparamvalue('itemid');
       if (id == undefined) id = 0;
       let page = data.toString().replace("{image}", getinformationwithid(id)[6]);
        pasteinmain(page);
       });
    }

    function defaultrequest() {
        if (url == '/') {
          home();
        } else {
          requestfile(url + '.html', err404, pasteinmain);
        }
    }

    
    
    //==================обработка запроса==========
    /*
    case '':  break;

    case '':{

      break;
    }
    */
    if (ssurl.length > 1) {
      fyletype = ssurl[1];
      requestfile(url, err404, (data) => {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/' + fyletype);
        response.end(data);
      });
    } else {
      switch (ssurl[0]) {
        case 'home': home(); break;
        case 'item': item(); break;
        case 'list': list(); break;
        default: defaultrequest();
      }
    }
  }catch (e) {
    console.log(e);
  }
}).listen(port,() => {console.log('Сервер начал прослушивание запросов на порту '+port);});

