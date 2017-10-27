var db_name = "bbsdb";
var db_url = "mongodb://localhost:27017/"+db_name;
var table = 'bbs';
var mongo = require("mongodb").MongoClient;
var ObjectID = require('mongodb').ObjectID;

mongo.connect(db_url, function(error, db){

    
    var text = ["안녕", "하이", "글올립니다.", "안녕하세요~","Hi", "야","반갑습니다","니하오", "지리구요","오지구요","인정?어 인정", "동의?어 보감","피카츄","라이츄","파이리","꼬부기","버터플","야도란","피죤투","또가스"];
    


    var id =["h921013", "root", "1004choen", "youhak", "kim", "single", "nom","battle","ground","hoho","hihi","iphone","yuna", "mouse","clock","time","table"];



    var content = "애플의 스마트폰 신제품 '아이폰8' 국내 예약판매가 시작됐다. 앞서 출시된 국가들에서 기대를 밑도는 판매량을 기록 중인 가운데, 국내 시장에서도 흥행하기 어렵다는 전망이 나온다.";  
    content += "SK텔레콤, KT, LG유플러스 등 이동통신 3사가 다음달 3일 '아이폰8' 정식 출시를 앞두고 27일 일제히 예판에 들어갔다. 아이폰 가입자 수 비중이 높은 KT의 경우, 예판 물량 5만대가 30분 만에 마감됐다."; 
    content += "그러나 아이폰7의 경우 같은 시점에 이통 3사의 예판 물량 10만대가 전부 마감된 것과 비교하면 부진한 기록이다. 아이폰 시리즈의 경우 워낙 국내 예판 물량이 적어 예판 성과로 실제 흥행 여부를 가늠하기 어렵다.";
    content += "출고가는 아이폰8 64GB(기가바이트) 94만6000원, 256GB 114만2900원, 아이폰8플러스 64GB 107만6900원, 256GB 128만3700원으로 책정됐다.";
    content += "아이폰8 국내 출시는 지난달 22일 미국과 중국, 일본 시장에 최초 출시된 지 한 달 이상 늦게 이뤄졌다. 아이폰8은 앞선 출시국들에서 기대에 미치지 못하는 성과를 냈다. 미국 시장조사업체 로컬리틱스에 따르면 아이폰8 출시 첫 달 판매량은 전작 '아이폰7'(3500만대)의 절반 수준인 1890만대에 불과하다. 출시를 앞둔 최신작 '아이폰X'에 소비자들의 관심이 집중되며 심각한 판매 부진에 빠졌다.";
    content += "국내 시장 반응 역시 크게 다르지 않을 전망이다. 역대 아이폰 시리즈 중 가장 주목받지 못하는 제품이 될 것이란 예상이 나올 정도다. 경쟁제품인 삼성전자 '갤럭시노트8'과 LG전자 'V30' 등이 한 달 전에 출시돼 시장을 선점했고, 아이폰X 대기 수요가 상당할 것으로 예상되기 때문이다. 충분한 초기 물량 확보에 실패한 아이폰X의 국내 출시는 내년에야 이뤄질 것으로 보인다.";
    content += "어중간한 가격대로 책정된 출고가 역시 악재로 작용할 전망이다. 아이폰8이 전작 아이폰7의 업그레이드 모델인 점을 고려하면 소비자들이 가격 부담을 느낄 수 있는 고가이기 때문이다. 상대적으로 저렴한 아이폰7에 비해 제품 경쟁력이 떨어진다는 분석이 나오는 이유다. 애플은 아이폰8 공개 직후 아이폰7 256GB 모델 판매를 중단했다. 아이폰8 대용량 모델을 팔기 위한 꼼수라는 지적이다.";
    
    var len = content.length;

    function randomContent(){
        var start = Math.floor((Math.random() * (len-101) ));
        var end = start+101;

        return content.substring(start, end);
    }

    // insert 를 10만개 처리하시오.
    // 배열선업
    for(var j = 0; j<100; j++){
        var array = [];
    
        for(var i = 0 ; i<1000; i++){
            var bbs = {
                title : randomContent(), 
                content : "내용입니다.",
                user_id :"",
                date : new Date()+ ""
            }
            bbs.user_id = id[Math.floor(Math.random() * id.length)];
            array[i] = bbs;
        }

        db.collection(table).insertMany(array, function(error, inserted){
            if(error){
                console.log(error);
            }else{
                console.log("입력 : " + i);
            }
        });
    }
   
    
    // Single Insert
    // db.collection(table).insert(bbs, function(error, inserted){
    //     if(error){
    //         callback(400);
    //     }
    // });

    //Multiple Insert
   
});

