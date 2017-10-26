// 외부에서 사용 가능하게 만들어주기
// exports : public 속성이라 생각하면 된다.
exports.a = 157;

var b = 159;

function sum(a, b){
  return a+b;
}

exports.sum = function(a,b){
  return a+b;
};
