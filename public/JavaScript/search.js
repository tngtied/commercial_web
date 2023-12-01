window.onload = function() {
    console.log("window loaded");


    const category = document.getElementById("category").innerText;
    const keyword = document.getElementById("keyword").innerText;
    console.log("search.js working...\ncategory: " + category + "\nkeyword: " + keyword);

    fetch("http://localhost:8000/search", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            category : category,
            keyword : keyword
        })
    })
        .then((res) => res.json())
        .then((data) => { 
            make_product_list(JSON.parse(data));
        })
        .catch((err) => console.log("err: ", err));

    function make_product_list(product_data){
        console.log("input product_data: ", product_data);


        var ProductList = document.createElement("div");
        var flag = true;
        
        for (const i in product_data){
            const product = product_data[i];
            // console.log(product_data[i]);
            if (flag){
                var ul_obj = document.createElement("ul");
                ul_obj.classList.add("row");
            }

            var li_obj = document.createElement("li");
            li_obj.classList.add("selling");

            var img_obj = document.createElement("img");
            img_obj.classList.add("bigger");
            img_obj.value = product.product_id;
            img_obj.onclick = function (){
                location.href = "/product/" + product.product_id;
            }
            // "location.href=(\'/product/'+product.product_id+'\')";
            img_obj.src = "/public/images/" + product.product_image;

            li_obj.appendChild(img_obj);
            ul_obj.appendChild(li_obj);

            if (flag){
                flag = false;
            }else{
                ProductList.appendChild(ul_obj);
                ProductList.appendChild(document.createElement("br"));
                flag = true;
            }
        }      
        document.getElementById("table").appendChild(ProductList);
    }
}