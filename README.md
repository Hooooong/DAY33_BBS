# Module 형식으로 게시판 만들기 (Node.js)

### 설명
____________________________________________________

- Module 형식으로 게시판 만들기 ( read, create 만 작성 )

### KeyPoint
____________________________________________________

- Module 형식으로 js 나누기

    - require 를 통해 Module을 인식한다.

    - Module 에 있는 Function 을 사용하기 위해 `exports` 를 앞에 붙여준다.

    ```javascript
    // Module 사용하기
    var route = require("./a_route");
    route.process(req,res);

    // Module 작성하기
    // exports. 를 붙여주면 된다.
    exports.process = function(req,res){
        // 로직 작성
    }
    ```

- URL 분석

    - `url`, `queryString` Module 을 사용해서 분석

    ```javascript
    // method 분석 (GET, POST, DELETE, PUT 등)
    var method = req.method;
    // url 분석
    // http://ip주소:port/bbs/~~~
    var url = u.parse(req.url);
    // ex) http://ip주소:port/bbs/~
    // pathname : /bbs/~
    var cmds = url.pathname.split("/");
    // cmds[0] = []
    // cmds[1] = bbs
    // cmds[n] = ~
  
    switch(cmds[1]){
      case "bbs":
        // bbs 이면 실행
        // 로직 작성
        if(method == 'get'){
            // get 일때 처리
            // queryString 을 통해 query object 를 넘겨줌
            var query = queryString모듈.parse(url.query);
            // query 사용
        }else{
            // body 를 넘겨줌
            var body = "";
            req.on('data', function(data){
                body += data;
            })
            req.on('end', function(){
                var body_data = JSON.parse(body);
                //body_data 사용
            })
        }
        break;
      default:
        break;
    }
    ```

- javascript callback 사용

    ![callback](https://github.com/Hooooong/DAY33_BBS-Server-/blob/master/image/callback.PNG)

    - Function 에 callback 메소드를 사용해서 데이터를 주고받는다.

- MongoDB 쿼리 

    - find(value, projection)

    ```javascript
    // 검색 query
    // value : 원하는 값을 검색할 때 사용
    // json 형식으로 입력({id:"123"})
    // projection : 원하는 값을 제거할 때 사용
    // json 형식으로 입력하되 값이 아닌 0과 1로 입력
    // 0 : 가져오지 않음, 1 : 가져옴
    find(value, projection)
    ```

    - sort()

    ```javascript
    // 정렬 query
    // value : 원하는 값을 정렬할 때 사용
    // 1 : 내림차순, -1 : 오름차순
    // json 형식으로 입력({_id: -1})
    sort(value)
    ```

    - skip(), limit()

    ```javascript
    // 집합
    // skip : count 를 시작할 index 의 위치
    // limit : 가져올 갯수를 정의
    skip(index).limit(count)
    // index부터 count개를 가져온다.
    ```
    
### Code Review
____________________________________________________

- server.js

    - server 연걸과 응답을 받기위해 대기하는 js

    ```javascript
    var http = require("http");
    var route = require("./a_route/route");


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
    ```

- route.js

    - URL, Method, query 분석을 통해 각 상황에 따른 controller를 실행하는 js

    ```javascript
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
    ```

- bbs.js (controller)

    - 각 상황에 따른 dao의 Method 를 실행하는 js

    ```javascript
    var dao = require("../c_dao/bbs");
    var ObjectID = require('mongodb').ObjectID;

    exports.read = function(req, res, search){
        // 1. 검색 대상 Query
        var query = {};

        switch(search.type){
            case "all":
                query = { page : search.page};
                break;
            case "_id":
                query = {_id:-1};
                query._id = ObjectID(search._id);
                break;
            case "title":
                query = {title:""};
                query.title = search.title;
                break;
        }

        dao.read(query, function(dataSet){
            var result = {
                code : 200,
                msg : "정상처리",
                data :  dataSet
            }
            // Object:JSON -> JSON String
            result = JSON.stringify(result);
            console.log(result);
            res.end(result);
        });
    }

    exports.create = function(req, res, bbs){
        dao.create(bbs, function(result_code){
            var result = {
                code : result_code,
                msg : "정상처리"
            }
            result = JSON.stringify(result);
            res.end(result);
        });
    }

    exports.update = function(req, res, bbs){

    }

    exports.delete = function(req, res, bbs){

    }
    ```

- bbs.js(dao)

    - 직접적인 MongoDB와의 연결을 담당하는 js

    ```javascript
    // db/index.js
    var db_name = "bbsdb";
    var db_url = "mongodb://localhost:27017/"+db_name;
    var table = 'bbs';
    var mongo = require("mongodb").MongoClient;
    var ObjectID = require('mongodb').ObjectID;

    var pagingCount = 20;

    // db CRUD
    exports.create = function(bbs, callback){
        mongo.connect(db_url, function(error, db){
            // Obejct 에 key 생성
            bbs['date'];
            // Object 에 값 넣기
            bbs.date = new Date()+"";
            db.collection(table).insert(bbs);
            if(error){
            callback(400);
            }else{
            callback(200);
            }
            db.close();
        }); 
    }

    exports.read = function(search, callback){
        mongo.connect(db_url, function(error, db){

            // find(값, proejction);
            // 0 : 가져오지 않음, 1 : 가져옴
            // 둘다 가져오거나, 둘다 안가져와야한다. 
            // 그러므로 안됨
            // var proejction = {title :1, content: 0}    
            //var proejction = {_id:0};

            // like 검색
            // find({title:/피/})
            // `피`가 포함되는 단어들을 찾는다.

            // sort();
            var sort = {
            _id : -1 // 1: 내림차순 , -1 : 오름차순
            }

            // 집합
            // skip : count 를 시작할 index 의 위치
            // limit : 가져올 갯수를 정의

            var start = (parseInt(search.page) - 1) * pagingCount;
            
            // 사용하지 않는 검색 컬럼은 삭제처리해야한다.
            delete search.page;
            var cursor = db.collection(table).find(search).sort(sort).skip(start).limit(pagingCount);

            cursor.toArray(function(error, documents){
            if(error){
                console.log(error);
            }else{
                // documents 처리
                callback(documents);
            }
            db.close();
            });
        });
    }

    exports.readOne = function(search, callback){
        mongo.connect(db_url, function(error, db){
            // 1. 검색 대상 Query
            var query = {};

            switch(search.type){
            case "all":
                query = {};
                break;
            case "_id":
                query = {_id:-1};
                query._id = ObjectID(search._id);
                break;
            case "title":
                query = {title:""};
                query.title = search.title;
                break;
            }
            var cursor = db.collection(table).find(query);

            cursor.toArray(function(error, documents){
            if(error){
                console.log(error);
            }else{
                // documents 처리
                callback(documents);
            }
            db.close();
            });
        });
    }

    exports.update = function(bbs){
        mongo.connect(db_url, function(error, db){
            // 1. 수정 대상 Query
            var query = {_id : -1};
            query._id = bbs._id;
            // 2. 데이터 수정 명령
            // 2-1. 수정할 목록만 작성
            // var operator = {
            //   no : 1,
            //   title : ""
            // }
            // operator.no = bbs.no;
            // operator.title = bbs.title;

            // 2-2. property 삭제
            var operator = bbs;
            delete operator._id;
            
            // 3. 수정 옵션
            // upsert : true 이면
            // 값이 있으면 update, 없으면 insert
            var option = {upsert : true};
                                                                    // error, update된 값
            db.collection(table).update(query, operator, option, function(error, updated){
            if(error){
                console.log("error");
            }else{
                // 정상 처리
                console.log("update 성공");
            }
            db.close();
            });
        
        });
    }

    exports.delete = function(bbs){
        mongo.connect(db_url, function(error, db){
            // 1. 삭제 대상 Query
            var query = {_id : -1};
            query._id = ObjectID(bbs._id);

            db.collection(table).remove(query, function(error, removed){
            if(error){

            }else{
                console.log("삭제 성공");
                console.log(removed);
            }
            db.close();
            });
        
        });
    }
    ```