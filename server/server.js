const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const URL = 'http://localhost'
const PORT = 1337;
const app = express();

// Greet
app.listen(PORT, () => {
  console.log(`Listening on ${URL}:${PORT}`);
});

// TODO: review this hack, currently needed for not getting the error "cannot set headers after they are sent to the client"
app.use(function(req,res,next){
    var _send = res.send;
    var sent = false;
    res.send = function(data){
        if(sent) return;
        _send.bind(res)(data);
        sent = true;
    };
    next();
});

// Add headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', `${URL}:3000`);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Enable JSON parsing in post requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Endpoints
app.post('/', (req, res) => {

  console.log(`COMPILING...`);
  const source = req.body.source;

  exec(
    `echo "${source}" | solc --opcodes`,
    (err, stdout, stderr) => {
      if(stderr) {
        res.send(`${stderr}`);
      }
      else {
        res.send(`${stdout}`);
      }
      console.log('Compilation finished.');
    }
  ); 
});
