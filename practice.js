

// const fs = require('fs')  //Practice code for using fs module
// const data = 'hello'
// fs.writeFile('./someFile.txt', data, (err)=>{
//     if(err){
//         console.log(err.mesage);
//     }
// })
// fs.readFile('./someFile.txt',  (err, content) => {
//         console.log(content);
// });
// setTimeout(() => {
//   fs.unlinkSync('./someFile.txt')
// }, 3000);




const http = require('http');
const resString = "<html><h1>Welcome to the server!!</h1></html>"
const server = http.createServer((req, res)=>{
  res.writeHead(200, {"Content-Type":"text/html"})
  res.write('lol')
  res.write(resString)
  res.end()
});
server.listen(3000)
console.log('Server started at port number 3000...')
