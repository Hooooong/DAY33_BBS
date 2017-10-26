var dao = require("../c_dao/bbs");
var ObjectID = require('mongodb').ObjectID;

exports.read = function(req, res, search){
    // 1. 검색 대상 Query
    var query = {};

    switch(search.type){
        case "all":
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
        result = JSON.stringify(result);
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