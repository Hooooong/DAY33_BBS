var http = require("http");
var route = require("./a_route");


/*
 서버와의 연결이 들어오면
 route.process()가 실행이 된다.
*/
var server = http.createServer(function(req, res){
  route.process(req,res);
});


/*
 서버 대기
*/
server.listen(8090, function(){
  console.log("Server is Running......");
});
