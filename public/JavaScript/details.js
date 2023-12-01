window.onload = function() {
    var product_id = document.URL.split("/")[4];
    
    fetch("http://localhost:8000/product_info/" + product_id)
        .then((res) => res.json())
        .then((data) => { 
            makeProductdetail(JSON.parse(data));
        })
        .catch((err) => console.log("err: ", err)
        );

    makeReviewForm(product_id);

    fetch("http://localhost:8000/reviews/" + product_id)
    .then((res) => res.json())
    .then((data) => { 
        make_reviews(JSON.parse(data));
    })
    .catch((err) => console.log("err: ", err));    
}

function make_reviews(reviewJson){
    comment_div = document.getElementById("comment");
    if (reviewJson){
        var i =1;
        for (const [dex, comment] of Object.entries(reviewJson)){
            const review_ul = document.createElement("ul");
            review_ul.classList.add("review");
            
            const review_li = document.createElement("li");
            review_li.innerText = i + '번째 리뷰: ' + comment;

            review_ul.appendChild(review_li);
            comment_div.appendChild(review_ul);
            i+=1;
        }
    }else{
        const review_ul = document.createElement("ul");
        review_ul.classList.add("review");

        const review_li = document.createElement("li");
        review_li.innerText = "리뷰가 없습니다";

        review_ul.appendChild(review_li);
        comment_div.appendChild(review_ul);
    }
}

function makeProductdetail(productinp){

    var item_info_div = document.getElementById("table");

    for (const [dex, product] of Object.entries(productinp)){
        var ul_obj = document.createElement("ul");
        ul_obj.classList.add("column");

        var li_obj = document.createElement("li");
        li_obj.classList.add("selling");

        var img_obj = document.createElement("img");
        img_obj.classList.add("hover");
        img_obj.src = "/public/images/" + product.product_image;

        li_obj.appendChild(img_obj);
        ul_obj.appendChild(li_obj);
        
        var info_li_obj = document.createElement("li");
        info_li_obj.style = "list-style-type : none;";

        var info_div_obj = document.createElement("div");
        info_div_obj.id = product.product_id;
        info_div_obj.innerText = "카테고리: " + product.product_category + "\n제품 아이디: " + product.product_id + "\n 제품명" + product.product_title + "\n 가격: " + product.product_price;
        
        info_li_obj.appendChild(info_div_obj);
        ul_obj.appendChild(info_div_obj);

        item_info_div.appendChild(ul_obj);
    }
}

function makeReviewForm(product_id){
    var form = document.createElement("form");
    form.style = "display: inline-block;";
    form.name = "search";
    form.method = "POST";
    form.action = "/product/" + product_id;
    
    var label = document.createElement('label');
    label.for = "comment";
    label.innerText = "리뷰 작성하기: ";
    form.appendChild(label);

    var textarea = document.createElement('textarea');
    textarea.type = "input";
    textarea.name = "update_comment_value";
    textarea.style = "width: 500px; display:inline-block;";
    textarea.placeholder = "리뷰를 작성하세요";
    form.appendChild(textarea);

    var submit_input = document.createElement("input");
    submit_input.classList.add("navitem");
    submit_input.type = "submit";
    form.appendChild(submit_input);

    comment_input_div = document.getElementById("comment_input");
    console.log("comment_input_div", comment_input_div);
    comment_input_div.appendChild(form);
}
