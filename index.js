const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const { type } = require("express/lib/response");

async function getDBConnection(){
    const db=await sqlite.open({
        filename: 'test.db',
        driver: sqlite3.Database
    });
    return db;
}

function makeProductList(productlist){
    var items = '';
        var flag = true;
            for (const [dex, product] of Object.entries(productlist)){
                // //console.log(product);
                if (flag){
                    items += '<ul class="column"><li class="selling"><img class="hovro" value="'+product.product_id+'" onclick="location.href=(\'/product/'+product.product_id+'\')" src="';
                    items += product.product_image;
                    items += '"></img>';
                    items+='</li>';
                    flag=false;
                }else{

                    //items += `<li class="selling"><img class="bigger" src="${value2['img']}"></img></li></ul><br>`;
                    items += '<li class="selling"> <img class="bigger" value="'+product.product_id+'" onclick="location.href=(\'/product/'+product.product_id+'\')" src="';
                    items += product.product_image;
                    items += '"></img>';
                    items+='</li></ul><br>';
                    flag=true;
                }
        }      
        return items;
        ////console.log(table);      
}

function makeProductdetail(productinp){
    var items = '';
    for (const [dex, product] of Object.entries(productinp)){
        items += '<ul class="column"><li  class="selling"><img class="hovro" " src="/public/';
        items += product.product_image;
        items += '"></img>';
        items+='</li>';
        items += '<li style="list-style-type : none;">';
        items+='<div  id="'+product.product_id+'">카테고리: '+product.product_category+'<br>제품 아이디: '+product.product_id+'<br>제품명: '+product.product_title+'<br>가격: '+product.product_price+'</div>';
        items+='</li></ul><br>';
    }
    return items;
}

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use("/public",express.static("public/"));
app.use("/",express.static("public/"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());




app.get("/", async function (req,res){
    // console.log("11111");
    let db = await getDBConnection();
    let rows = await db.all('SELECT * FROM product');
    await db.close();
    // console.log(rows);
    var contenthtml = makeProductList(rows);
    // console.log(contenthtml);
    res.render('index', {contents : contenthtml, state: ""});
});

function makeReviewForm(product_id){
    let ret = '<form style="display: inline-block;" name = "search" method="POST" action="/product/'+product_id+'">';
    ret+= '<label for="comment">리뷰 작성하기: </label>';
    ret+='<textarea type="input" name="updatecommentvalue" style="width: 500px; display:inline-block;" placeholder="리뷰를 작성하세요"> </textarea>'
    ret+='<input class="navitem" type="submit"> </form>'
    return ret;
}

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

function makeComment(inputval){
    var items = '';
    //console.log(inputval);
    var i =1;
    for (const [dex, comment] of Object.entries(inputval)){
        items += '<ul class="review"><li class="reviewtext">'+i+'번째 리뷰: ';
        //console.log(comment);
        items += comment;
        items+='</li></ul>';
        i+=1;
    }
    return items;
}

const commentjson = JSON.parse(fs.readFileSync(`public/comment.json`) );
//console.log("commentjson "+typeof(commentjson));

// require( './comment.json');

app.post("/product/:product_id", async function (req,res){
    let db = await getDBConnection();
    //console.log(req.params.product_id);
    let productid =  req.params.product_id;
    let rows = await db.all('SELECT * FROM product WHERE product_id='+productid);
    await db.close();
    var contenthtml = makeProductdetail(rows);



    //console.log(commentjson);
    //console.log(productid);
    if (commentjson.hasOwnProperty(productid) ){
        commentjson[productid].push(req.body.updatecommentvalue);
    }else{
        commentjson[productid] = [req.body.updatecommentvalue];
    }
    //console.log(commentjson);

    var reviewhtml = makeReviewForm(req.params.product_id);

    // if (comment){
    //     commenthtml+=makeComment(comment)
    // }else{
    //     commentJSON
        
    // }


    fs.writeFileSync(`public/comment.json`, JSON.stringify(commentjson), function writeJSON(err, val){
        if (err){
            return //console.log(err);
        }
        // //console.log('writing to ' + fileName);
    });
    var comment = commentjson[productid];
    let commentshtml = makeComment(comment);

    res.render('details', {contents : contenthtml, commentplace: commentshtml, reviewplace: reviewhtml });

});


app.get("/product/:product_id", async function (req, res) {
    let db = await getDBConnection();
    let productidvar = req.params.product_id;
    //console.log(productidvar);
    let rows = await db.all('SELECT * FROM product WHERE product_id='+req.params.product_id);
    await db.close();


    var contenthtml = makeProductdetail(rows);
    var comment = commentjson[productidvar];
    var commentshtml  = '';
    var reviewhtml = makeReviewForm(req.params.product_id);
    if (comment){
        commentshtml+=makeComment(comment)
    }else{
        commentshtml+='<ul class="review"><li>리뷰가 없습니다</li></ul>'

    }
    res.render('details', {contents : contenthtml, commentplace: commentshtml, reviewplace: reviewhtml });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    //console.log("서버가 실행됐습니다.");
    //console.log(`서버주소: http://localhost:${PORT}`);
});

// app.post("/write-file", function(req, res){
//     //console.log(req.body);
//     if (!req.body?.content){
//         res.status(400).send("400 에러! content가 post body에 없습니다.");
//         return;
//     }

// });