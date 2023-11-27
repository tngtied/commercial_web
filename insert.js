//insert.js
const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.static("public"));
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

async function getDBConnection(){
    const db=await sqlite.open({
        filename: 'test.db',
        driver: sqlite3.Database
    });
    return db;
}
var jsonRow = `{
    "earling" : [
        {
            "name" : "굴 귀걸이",
            "img" : "oyster_earring.jpg",
            "price":"19000"
        },
        {
            "name" : "나비 날개 귀걸이",
            "img" : "butterfly_ear.jpg",
            "price":"17000"
        
        },
        {
            "name" : "포도 귀걸이",
            "img" : "grape_ear.jpg",
            "price":"21000"
        
        },
        {
            "name" : "배 귀걸이",
            "img" : "pear_ear.jpg",
            "price":"15000"
        
        },
        {
            "name" : "물고기 꼬리 귀걸이",
            "img" : "tail_ring.jpg",
            "price":"17000"
        },
        {
            "name" : "물고기 귀걸이",
            "img" : "fish_ear.jpg",
            "price":"19000"
        }
    ],
    "ring" : [
        {
            "name" : "핑크 스톤 반지",
            "img" : "pinkstone_ring.jpg",
            "price":"23000"

        },
        {
            "name" : "하트 보석 반지",
            "img" : "heart_ring2.jpg",
            "price":"25000"
        
        },
        {
            "name" : "박쥐 반지",
            "img" : "bat_ring.jpg",
            "price":"16000"
        
        },
        {
            "name" : "맞잡은 손 반지",
            "img" : "hand_ring.jpg",
            "price":"15000"
        
        },
        {
            "name" : "이빨 반지",
            "img" : "teeth_ring.jpg",
            "price":"19000"
        },
        {
            "name" : "버섯 반지",
            "img" : "mushroom_ring.jpg",
            "price":"15000"
        },
        {
            "name" : "토끼 반지",
            "img" : "hare_ring.jpg",
            "price":"19000"
        },
        {
            "name" : "고양이 반지",
            "img" : "cat_ring.jpg",
            "price":"16000"
        }

    ],
    "necklace" : [
        {
            "name" : "사각형 보석 목걸이",
            "img" : "rectangle_necklace.jpg",
            "price":"17000"
        
        },
        {
            "name" : "가오리 목걸이",
            "img" : "stingray_neck.jpg",
            "price":"19000"
        
        },
        {
            "name" : "석류 목걸이",
            "img" : "pomegranat_neck.jpg",
            "price":"20000"
        
        },
        {
            "name" : "물방울 목걸이",
            "img" : "drip_neck.jpg",
            "price":"17000"
        },
        {
            "name" : "사슴 뿔 목걸이",
            "img" : "horn_neck.jpg",
            "price":"17000"
        },
        {
            "name" : "뱀 목걸이",
            "img" : "snake_neck.jpg",
            "price":"21000"
        }
    ]
}
`;

app.use(express.json());
var parsedJSON = JSON.parse(jsonRow);
console.log(parsedJSON);
async function dbrun (){
    let db = await getDBConnection();
for (const [category,items] of Object.entries(parsedJSON)){
    for (const [key,productJSON] of Object.entries(items)){
        //console.log(productJSON['img']+' '+productJSON['name']+' '+productJSON['price']+' '+category);
        await db.run(`INSERT INTO product (product_image, product_title, product_price, product_category) VALUES('${productJSON['img']}', '${productJSON['name']}', '${productJSON['price']}','${category}')`);
    }
}
}
dbrun();

