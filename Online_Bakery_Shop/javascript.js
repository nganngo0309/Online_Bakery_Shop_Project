const name_item = document.querySelectorAll('.name_item');//tên sản phẩm
const search_item = document.getElementById('search-item');//input search sản phẩm
const element_cakes = document.querySelectorAll('.element_cakes');//box sản phẩm
const filter_button = document.querySelectorAll('#filter_button .btn');//button lọc sản phẩm 
const h1_price = document.querySelectorAll('h1.price');//giá sản phẩm

// khi ta nhả key trên bàn phím (gọi là sự kiện keyup) vào input search sản phẩm thì sẽ thực thi function getItem()
search_item.addEventListener('keyup',getItem);

// khi ta click vào input search sản phẩm thì sẽ thực thi function reset()
search_item.addEventListener('click',reset);

// khi click vào tìm kiếm => all to search
function reset(){
    for(let i=0;i<filter_button.length;i++){
        filter_button[i].classList.remove('active');
    }
    Array.from(element_cakes).forEach(function(element){
        element.style.display = 'block';
    })
    filter_button[0].classList.add('active');
}


// tìm kiếm sản phẩm 
const h1Text = document.getElementById('showtext');//phần này hiển thị (can't find) khi không tìm thấy được sản phẩm nào 
const infor = document.querySelectorAll('.infor');//tên sản phẩm
function getItem(event){
    // chuyển đổi văn bản thành chuỗi LowerCase để tìm kiếm
    let lower_item = search_item.value.toLowerCase();
    Array.from(infor).forEach(function(cake){
        let item_Name = cake.firstElementChild.textContent;
        if(item_Name.toLowerCase().indexOf(lower_item) != -1){
            cake.parentElement.style.display = 'block';
        }
        else {            
            cake.parentElement.style.display = 'none';
            
        }
    })
    
    checkNone(infor);
}

// function kiểm tra: nếu tất cả tên sản phẩm đều không được tìm kiếm => textContent = 'can't find' 
function checkNone(target_element){
    var sum=0;
    for(let i=0;i<target_element.length;i++){
        if(target_element[i].parentElement.style.display === 'block'){
            sum++;
        }
    }
    if(sum==0){
        h1Text.textContent = "can't find.";
    }
    else {
        h1Text.textContent = "";
    }
}

// button lọc sản phẩm
Array.from(filter_button).forEach(function(button){//
    button.addEventListener('click',function(event){
        // khi click vào bất kì button lọc sản phẩm nào thì button active (background là màu đỏ được thiết lập trong file css)
        // và các button còn lại sẽ mang màu background ban đầu (màu hồng)
        for(let i=0;i<filter_button.length;i++){
            filter_button[i].classList.remove('active');
        }
        this.classList.add('active');//

        let buttonAttr = event.target.dataset.filter; // lấy dữ liệu của filter
        Array.from(element_cakes).forEach(function(element){
            let elementAttr = element.dataset.item; // sử dụng dataset để lấy giá trị dữ liệu 
            if(buttonAttr === elementAttr  || buttonAttr === 'all'){
                element.style.display = 'block';
            }   
            else {
                element.style.display = 'none';
            }
        })
    })
})


// modal box
const arrayImg = ['cake-1','cake-2','cake-3','cupcake-1','cupcake-2','cupcake-3',
'doughnut-1','doughnut-2','doughnut-3','sweets-1','sweets-2','sweets-3'];
const modal_div = document.getElementById('modal');
const imgBox = document.querySelector('.lightbox');//ảnh sản phẩm

const shopping_cart = document.querySelector('.shoppingCart'); 
let notifi = document.querySelector('.notification'); // thông báo nếu không có thành phần nào trong giỏ hàng
let priceAll = document.querySelector('.priceProduct'); // cập nhật giá sau khi nhấp vào mua

shopping_cart.addEventListener('click',deleteItem);
function deleteItem(){
    let trash = document.querySelectorAll('.fa-trash'); //icon xóa sản phẩm
    let div_name = event.target.parentElement.querySelector('.item-text');//phần tên sản phẩm

    // xóa sản phẩm và cập nhật bộ lại bộ nhớ (local Storage) 
    if(event.target.classList.contains('fa-trash')){
        if(confirm('Are you sure ?')==true){
            div_name.firstElementChild.classList.add('clicked');
            for(let i = 0;i<StorageItems.length;i++){
                let find_class_clicked = trash[i].parentElement.querySelector('.item-text');
                // tìm mục của phần tử có class được nhấp và loại bỏ
                if(find_class_clicked.firstElementChild.classList.contains('clicked')){
                    StorageItems.splice(i,1); // xóa
                    div_name.classList.remove('clicked');
                    count--; // giảm số lượng và cập nhật
                    if(count == 0){
                        notifi.style.display = 'block';
                    }
                    else {
                        notifi.style.display = 'none';
                    }
                }
            }
            bought.textContent = count; // cập nhật số lượng sau khi nhấp vào loại bỏ
            let price_item = div_name.lastElementChild.textContent; // lấy giá trị của phần tử
            price_all_sum -= parseFloat(price_item);
            priceAll.textContent = roundNumber(price_all_sum);
            event.target.parentElement.remove(); // loại bỏ mục có class được nhấp vào

            // cập nhật localStorage
            localStorage.setItem('Items',JSON.stringify(StorageItems));
            let objectPriceAndCount = {'priceAll':roundNumber(price_all_sum),'count':count};
            StoragePriceAndCount = [];
            StoragePriceAndCount.push(objectPriceAndCount);
            localStorage.setItem('Price_Count',JSON.stringify(StoragePriceAndCount));
        }
    }
    
}

let StorageItems = [];
let StoragePriceAndCount = [];
let pos = 0;
let count = 0; // đây là con số khi bạn nhấp vào mua nó sẽ giảm hoặc tăng lên
let sumPrice = 0; // tổng số mặt hàng bạn nhấp vào mua
let price_all_sum = 0; //tổng giá tiền
let bought = document.querySelector('.count');


getlocalStorage(); // khi bạn mở trang này sẽ được nhận được giá trị từ localStorage
Array.from(element_cakes).forEach(function(cake){
    cake.addEventListener('click',function(){
        // lấy giá trị của thuộc tính src của img bạn đã nhấp và đẩy vào localStorage
        let srcImg = this.firstElementChild.getAttribute('src');
        
        let clickBuy = event.target.classList;
        if(clickBuy.contains('buy')){
            count++;

            if(count != 0){
                notifi.style.display = 'none';
            }
            
            // tên, giá của món hàng bạn bấm mua
            let siblingclickBuy = event.target.previousElementSibling;
            let nameofitem = siblingclickBuy.firstElementChild.textContent;
            let divofprice = siblingclickBuy.lastElementChild;
            let priceofitem = divofprice.textContent;
            
            bought.textContent = count;

            sumPrice = parseFloat(priceofitem);
            price_all_sum += sumPrice;

            priceAll.textContent = roundNumber(price_all_sum);

            setlocalStorage(srcImg,nameofitem,priceofitem,roundNumber(price_all_sum),count);
            // thêm nội dung vào div sử dụng mẫu chữ javascript
            shopping_cart.insertAdjacentHTML('beforeend',`<div class="cart_item">
            <div class="cart_img_item">
                <img src=${srcImg} alt="">
            </div>
            <div class="item-text">
                <p class="cart-item-title">${nameofitem}</p>
                <div class="item-price">
                    <span id="cart-item-price">${priceofitem}</span>
                </div>
            </div>
            <i class="fa fa-trash" style="align-items: center;display: flex;" aria-hidden="true">
            </i>
            </div>`)
            
            // khi click mua sẽ xuất hiện dòng chữ với nội dung "..."
            let moved = document.createElement('div');
            moved.textContent = `moved ${nameofitem} to cart`;
            moved.style.position = 'relative';
            moved.style.top = '19.5%';
            moved.style.fontSize = '1.125rem';
            moved.style.color = 'red';
            event.target.parentElement.appendChild(moved);

            setTimeout(function(){
                cake.lastElementChild.remove()
            },2000)
            
        }
        else {
            for(let i=0;i<arrayImg.length;i++){
                if(srcImg.indexOf(arrayImg[i]) != -1){
                    modal_div.style.display = 'block';
                    imgBox.style.backgroundImage = `url(images/${arrayImg[i]}.jpeg)`;
                    imgBox.style.backgroundSize = 'cover';
                    imgBox.style.backgroundPosition = 'center';
                    pos = i;
                }
            }
        }
    })
})

function setlocalStorage(src_Img,name_item,price_item,price_all,count_item){
    let objectItems = {'src_Img':src_Img,'name_item':name_item,'price_item':price_item};
    let objectPriceAndCount = {'priceAll':price_all,'count':count_item};
    StorageItems.push(objectItems);
    StoragePriceAndCount = [];
    StoragePriceAndCount.push(objectPriceAndCount);
    localStorage.setItem('Items',JSON.stringify(StorageItems));
    localStorage.setItem('Price_Count',JSON.stringify(StoragePriceAndCount));
}
function getlocalStorage(){
    if(localStorage.getItem('Items') == null || localStorage.getItem('Items') == undefined){
        StorageItems = [];
        StoragePriceAndCount = [];
    }
    else{
        getFromLocalStorage = JSON.parse(localStorage.getItem('Items'));
        StorageItems = getFromLocalStorage;
        getPriceAndCount = JSON.parse(localStorage.getItem('Price_Count'));
        StoragePriceAndCount = getPriceAndCount;
        // them sản phẩm từ StorageItems nếu có giá trị 
        for(let i=0;i<StorageItems.length;i++){
            shopping_cart.insertAdjacentHTML('beforeend',
            `<div class="cart_item">
                <div class="cart_img_item">
                    <img src=${StorageItems[i]['src_Img']} alt="">
                </div>
                <div class="item-text">
                    <p class="cart-item-title">${StorageItems[i]['name_item']}</p>
                    <div class="item-price">
                        <span id="cart-item-price">${StorageItems[i]['price_item']}</span>
                    </div>
                </div>
                <i class="fa fa-trash" style="align-items: center;display: flex;" aria-hidden="true">
                </i>
            </div>`)
        }
        // lấy số lượng và giá từ StoragePriceAndCount và cập nhật trên div
        count = StoragePriceAndCount[0]['count'];
        price_all_sum = StoragePriceAndCount[0]['priceAll'];

        notifi.style.display = 'none';
        bought.textContent = count;  

        priceAll.textContent = roundNumber(price_all_sum); 
    }
}
function roundNumber(number){
    return Math.round(number*1000)/1000;
}


// button modal box
const leftBt = document.querySelector('.fa-caret-left');
const rightBt = document.querySelector('.fa-caret-right');

leftBt.addEventListener('click',slidePre);
function slidePre(){
    pos--;
    if(pos < 0){
        pos = arrayImg.length - 1;
    }
    imgBox.style.backgroundImage = `url(images/${arrayImg[pos]}.jpeg)`;
}
rightBt.addEventListener('click',slideNext);
function slideNext(){
    pos++;
    if(pos > arrayImg.length-1){
        pos = 0;
    }
    imgBox.style.backgroundImage = `url(images/${arrayImg[pos]}.jpeg)`;
}

modal_div.addEventListener('click',function(event){
    let eventButton = event.target.classList;
    if(eventButton.contains('fa-caret-left') || eventButton.contains('fa-caret-right')){
        this.style.display = 'block';
    }
    else{
        this.style.display = 'none';
    }
})

const buttonTop = document.querySelector('.button');
buttonTop.addEventListener('click',getProduct);
// function kiểm tra giỏ hàng có nội dung hay không
function getProduct(){
    if(shopping_cart.style.display === 'none'){
        shopping_cart.style.display = 'block';
        if(count == 0){
            notifi.style.display = 'block';
        }
        else {
            notifi.style.display = 'none';
        }
    }
    else {
        shopping_cart.style.display = 'none';
    }
}

// function to find parent of child
function getParent(childOfparent,nameclass){
    while(childOfparent = childOfparent.parentElement){
        if(childOfparent.classList.contains(nameclass)){
            return childOfparent;
        }
    }
}


