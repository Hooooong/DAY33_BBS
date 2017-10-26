// 외부 모듈 사용하기
// module 파일을 찾거나
// 없으면 폴더를 찾아
// index.js 파일을 실행한다.
var db = require("./c_dao");

var bbs = {
  no : 2,
  title : "제목3",
  content : "내용3",
  data : "2017-10-28 12:20:00",
  user_id : "root"
}

var search ={
  type : "no",
  no : 2,
  //{$regex:"제"} : title 에서 "제" 가 포함되는 문자열을 검색
  title : {$regex:"제"},
  content : "내용",
  date : "2017-10-26 12:20:00",
  user_id : "root"
}

// db.create(
//   bbs, 
//   function(answer){
//     console.log("answer : " + answer);
//   }
// )

// db.read(
//   search,
//   function(dataSet){
//     for(key in dataSet){
//         console.log(dataSet[key]);
//     }
//   }
// )

db.readOne(
  search,
  function(dataSet){
    if(dataSet.length > 0){
      // 서버에서 수정할 데이터 조회
      var bbas = dataSet[0];
      // > 모바일 > json Data
      var json = JSON.stringify(bbs)
      // 모바일에서 수정을 거치고

      // Android 에서 .....
      // 다시 서버로 bbs json data
      var modified = JSON.parse(json);
      modified.title = "수정했습니다.";
      var mod_json = JSON.stringify(modified);
      // ............................(안드로이드)

      // > 서버
      var completed = JSON.parse(mod_json);
      db.update(completed);
      
    }
  }
)