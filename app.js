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
	console.log('Url: ' + request.url);
	
	if (request.url == '/'){
		fs.readFile(path.join(__dirname,'data','home.html'), (err, data) => {
			if (err) {
				console.log('ошибка при запросе: ' + request.url);
				response.statusCode = 404;
				response.setHeader('Content-Type', 'text/plain');
				response.end('Error');
			}
			response.statusCode = 200;
			response.setHeader('Content-Type', 'text/html');
			response.end(data);
		});
	}
	else{
		fs.readFile(path.join(__dirname,'data'+request.url), (err, data) => {
			if (err) {
				console.log('ошибка при запросе: ' + request.url);
				response.statusCode = 404;
				response.setHeader('Content-Type', 'text/plain');
				response.end('Error');
			}
			else {
				response.statusCode = 200;
				//switch (request.url)
				//response.setHeader('Content-Type', 'text/html');
				response.end(data);
			}
		});
	}
	
	 
}).listen(port,() => {console.log('Сервер начал прослушивание запросов на порту '+port);});

