const express = require('express');
const app = express();
const server = require('http').Server(app);
const port = process.env.PORT || 3000;

server.listen(port, () =>{
  console.log(`Server is running on ${port}`);
});
