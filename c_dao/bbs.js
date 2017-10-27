// db/index.js
var db_name = "bbsdb";
var db_url = "mongodb://localhost:27017/"+db_name;
var table = 'bbs';
var mongo = require("mongodb").MongoClient;
var ObjectID = require('mongodb').ObjectID;

var pagingCount = 20;

/*
  var bbs = {
    no : 12,
    title : "제목",
    content : "내용",
    date : "2017-10-26 09:00:00",
    user_id : "root",
  }

  var search = {
    type : "검색조건"     // all : 전체검색, no : 글 한개 검색, title : 제목 검색
    no : 12,
    title : "제목 검색",
    content : "내용 검색",
    date : "날짜 검색",
    user_id : "사용자 검색
  }
*/

/*
exports.Bbs = function(){
  this.no = -1;
  this.title = "";
  this.content = "";
  this.date = "";
  this.user_id = "";

  this.toQuery = function(){
    var bbs = {
      no : -1,
      title : "",
      content : "",
      date : "",
      user_id : "",
    }

    bbs.no = this.no;
    bbs.title = this.title;
    bbs.content = this.content;
    bbs.date = this.date;
    bbs.user_id = this.user_id;

    return bbs;
  }
}

exorts.search = {
  type : ""     // all : 전체검색, no : 글 한개 검색, title : 제목 검색
  no : -1,
  title : "",
  content : "",
  date : "",
  user_id : ""
}
*/

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
