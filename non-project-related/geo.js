var https = require('https');

const options = {
  path: '/60.53.244.255/json/',
  host: 'ipapi.co',
  port: 443,
  headers: { 'User-Agent': 'nodejs-ipapi-v1.02' }
};
https.get(options, function(resp){
    var body = ''
    resp.on('data', function(data){
        body += data;
    });

    resp.on('end', function(){
        var loc = JSON.parse(body);
        console.log(loc);
    });
});