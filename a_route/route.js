var bbs = require("../b_controller/bbs");
var u = require("url");
var qs = require("querystring");

var method = "";
var url = "";

exports.process = function(req,res){
    // url 분석
    url = u.parse(req.url);
    // method 분석 (GET, POST, DELETE, PUT 등)
    method = req.method.toLowerCase();
    // pathname 을 '/' 으로 분할
    var cmds = url.pathname.split("/");
  
    // ex) http://localhost:8090/bbs/~
    // cmds[0] = []
    // cmds[1] = bbs
    switch(cmds[1]){
      case "bbs":
        // bbs 이면 실행
        methodProcess(req, res);
        break;
      default:
        break;
    }
}

// bbs 처리
// Method 를 분석하여 
// 그 Method 에 맞는 process 실행
function methodProcess(req, res){

    if(method == 'get'){
        var query = qs.parse(url.query);
        bbs.read(req, res, query);
    }else{
        var body ="";

        req.on('data', function(data){
            body += data;
        });

        req.on('end', function(){
            
            var bbd_body = JSON.parse(body);

            switch(method){
                case "post":
                bbs.create(req, res, bbd_body);
                break;
            case "put":
                bbs.update(req, res, bbd_body);
                break;
            case "delete":
                bbs.delete(req, res, bbd_body);
                break;
            }
        });

    }
}