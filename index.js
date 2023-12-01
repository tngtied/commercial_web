const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const SqliteToJson = require('sqlite-to-json');
const { type } = require("express/lib/response");

async function getDBConnection(){
    const db=await sqlite.open({
        filename: 'test.db',
        driver: sqlite3.Database
    });
    return db;
}



app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use("/public",express.static("public/"));
app.use("/",express.static("public/"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
    
app.get("/product_list", async function(req, res){
    console.log("getting product list from server-side");
    let db = await getDBConnection();
    let data = await db.all('SELECT * FROM product');
    await db.close();
    res.json(JSON.stringify(data));
});

app.get("/", async function (req,res){
    res.render('index', {'state' : ''});
});

app.get("/reviews/:product_id", async function (req,res){
    const reviewJson = JSON.parse(fs.readFileSync(`public/comment.json`) )[req.params.product_id];

    res.json(JSON.stringify(reviewJson));
});


app.post("/searched", async function (req,res){
    let db = await getDBConnection();
    // console.log("여기까지 왔어요!");
    // console.log(req.body.categories+" "+req.body.keyword)
    let category = req.body.categories;
    let targetword= req.body.keyword;
    var querysent = 'SELECT * FROM product WHERE true';
    if (category){
        if (category!='all'){
            querysent+= ' AND product_category="'+category+'"';
        }
    }else{
        category='모두 보기';
    }
    if (targetword){
        querysent+= ` AND product_title LIKE '%`+targetword+`%'`;
    }
    // //console.log(querysent);
    let rows = await db.all(querysent);
    await db.close();
    var contenthtml = makeProductList(rows);
    res.render('index', {contents : contenthtml, state: '카테고리 '+category+', 키워드 "'+targetword+'"로 검색하는 중입니다'});
});





app.post("/product/:product_id", async function (req,res){
    const commentjson = JSON.parse(fs.readFileSync(`public/comment.json`) );

    let db = await getDBConnection();
    let productid =  req.params.product_id;
    let rows = await db.all('SELECT * FROM product WHERE product_id='+productid);
    await db.close();
    var contenthtml = makeProductdetail(rows);

    if (commentjson.hasOwnProperty(productid) ){
        commentjson[productid].push(req.body.update_comment_value);
    }else{
        commentjson[productid] = [req.body.update_comment_value];
    }
    var reviewhtml = makeReviewForm(req.params.product_id);



    fs.writeFileSync(`public/comment.json`, JSON.stringify(commentjson), function writeJSON(err, val){ });
    var comment = commentjson[productid];
    let commentshtml = makeComment(comment);

    res.render('details', {contents : contenthtml, commentplace: commentshtml, reviewplace: reviewhtml });

});

app.get("/product_info/:product_id", async function (req, res) {
    let db = await getDBConnection();
    let productidvar = req.params.product_id;
    //console.log(productidvar);
    let data = await db.all('SELECT * FROM product WHERE product_id='+req.params.product_id);
    await db.close();
    res.json(JSON.stringify(data));
});


app.get("/product/:product_id", async function (req, res) {

    

    // var comment = commentjson[productidvar];
    // var commentshtml  = '';
    // var reviewhtml = makeReviewForm(req.params.product_id);

    //contents : contenthtml, commentplace: commentshtml, reviewplace: reviewhtml
    res.render('details', {});
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log("서버가 실행됐습니다.");
    console.log(`서버주소: http://localhost:${PORT}`);
});