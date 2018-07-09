var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'GOLDPOINT-API',
  description: 'This starts web server.',
  script: 'XXX\\app.js',
  nodeOptions: [
  ]
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

//svc.uninstall();
svc.install();
