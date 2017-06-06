const express = require('express');
const app = express();
const http = require('http').Server(app);
const fs = require('fs');

const PORT = 8888;


app.use(express.static(__dirname+'/public'));


http.listen(PORT, function(){
  console.info('[ADMIN]',`listening on port ${PORT}`);
});