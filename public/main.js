async function makeProductList(){
    const res = await fetch("http://localhost:8000/product_list"); 

    console.log(res);
    
    const product_data = res
    var ProductList = document.createElement("div");
    var flag = true;
    for (const [dex, product] of Object.entries(product_data)){
        console.log(product);
        if (flag){
            var ul_obj = document.createElement("ul");
            ul_obj.classList.add("row");
        }

        var li_obj = document.createElement("li");
        li_obj.classList.add("selling");

        var img_obj = document.createElement("img");
        img_obj.classList.add("bigger");
        img_obj.value = product.product_id;
        img_obj.onclick = "location.href=(\'/product/'+product.product_id+'\')";
        img_obj.src = "/public/images/" + product.product_image;

        li_obj.appendChild(img_obj);
        ul_obj.appendChild(li_obj);

        if (flag){
            flag = False;
        }else{
            ProductList.appendChild(ul_obj);
            ProductList.appendChild(document.createElement("br"));
            flag = True
        }
    }      
    document.getElementById("table").appendChild(product_list);
    
}
window.addEventListener('load', makeProductList, false);
console.log("main.js running...");



