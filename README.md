# Module 형식으로 게시판 만들기 (Node.js)

### 설명
____________________________________________________

- Module 형식으로 게시판 만들기 ( read, create 만 작성 )

### KeyPoint
____________________________________________________

- Module 형식으로 js 나누기

    - require 를 통해 Module 인식한다.

    - Module 에 있는 Function 을 사용하기 위해 `expㅐorts` 를 앞에 붙여준다.

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

    ![callback]()

    - Function 에 callback 메소드를 사용해서 데이터를 주고받는다.

- MongoDB 쿼리 

    - find(value, projection)

    ```javascript
    // 검색 query
    find(value, projection)
    // value : 원하는 값을 검색할 때 사용
    // json 형식으로 입력({id:"123"})
    // projection : 원하는 값을 제거할 때 사용
    // json 형식으로 입력하되 값이 아닌 0과 1로 입력
    // 0 : 가져오지 않음, 1 : 가져옴
    ```

    - sort()

    ```javascript
    // 정렬 query
    // value : 원하는 값을 정렬할 때 사용
    // 1 : 내림차순, -1 : 오름차순
    // json 형식으로 입력({_id: -1})
    sort(value)
    ```

    -

