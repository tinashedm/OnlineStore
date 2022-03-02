let carts = document.querySelectorAll('.addToCart');

//Creating an array for our products
let products = [ 
    {
        name: "2pack_Body_Vests",
        tag: "2pack_Body_Vests",
        price: 65,
        inCart: 0
    },
    { 
        name: "Little_Girl_Summer_Dress",
        tag: "Little_Girl_Summer_Dress",
        price: 50,
        inCart: 0
    },
    {
        name: "Floral_Dress",
        tag: "Floral_Dress",
        price: 60,
        inCart: 0
    },
    {
        name: "Embroidered_Womens_Tops",
        tag: "Embroidered_Womens_Tops",
        price: 45,
        inCart: 0
    }
];

//Adding click event to all Add To Cart buttons on the catalogue page
/*Clicking on these buttons will add the product to cart, update the product 
    count on the menu bar and update the cart sub-total*/
for(let i=0; i< carts.length; i++) {
    carts[i].addEventListener('click', () => {
        cartNumbers(products[i]);
        totalCost(products[i]);
    });
    
}

//Add to cart button on individual product's page
/*Clicking button will add the product to cart, update the product 
    count on the menu bar and update the cart sub-total*/
function addProdToCart(x) {
        cartNumbers(products[x]);
        totalCost(products[x]);
}

//Function to display product count on the navbar menu
function onLoadCartNumbers() {
    let productNumbers = localStorage.getItem('cartNumbers');
    if( productNumbers ) {
        document.querySelector('.cart span').textContent = productNumbers;
    }
}


// Function to place products into cart as well as update the product count on the menu bar 
function cartNumbers(product, action) {
    let productNumbers = localStorage.getItem('cartNumbers');
    productNumbers = parseInt(productNumbers);

    if( action ) {
        localStorage.setItem("cartNumbers", productNumbers - 1);
        document.querySelector('.cart span').textContent = productNumbers - 1;
        console.log("action running");
    } else if( productNumbers ) {
        localStorage.setItem("cartNumbers", productNumbers + 1);
        document.querySelector('.cart span').textContent = productNumbers + 1;
    } else {
        localStorage.setItem("cartNumbers", 1);
        document.querySelector('.cart span').textContent = 1;
    }
    setItems(product);
}

//Function to place products into cart
function setItems(product) {
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);

    if(cartItems != null) {
        let currentProduct = product.tag;
    
        if( cartItems[currentProduct] == undefined ) {
            cartItems = {
                ...cartItems,
                [currentProduct]: product
            }
        } 
        cartItems[currentProduct].inCart += 1;
        
    } else {
        product.inCart = 1;
        cartItems = { 
            [product.tag]: product
        };
    }
    localStorage.setItem('productsInCart', JSON.stringify(cartItems));
}

//Function to calculate sub-total of items in cart
function totalCost( product, action ) {
    let cart = localStorage.getItem("totalCost");

    if( action) {
        cart = parseInt(cart);

        localStorage.setItem("totalCost", cart - product.price);
    } else if(cart != null) {
        
        cart = parseInt(cart);
        localStorage.setItem("totalCost", cart + product.price);
    
    } else {
        localStorage.setItem("totalCost", product.price);
    }
    alert("Current Total (incl. VAT) is: R" + (JSON.parse(localStorage.getItem("totalCost") * 1.15).toFixed(2)));
}

//Function to check sub-total and apply respective discount coupon
function applyDiscount(){
    let finalDiscount = 0;
    let promocode = $('#in').val();
    let subTotal = parseFloat(document.getElementById('subTotal').innerHTML);
    let discountCode = ['disc10','disc15'];
    let cartItems = localStorage.getItem('productsInCart'); 
    cartItems = JSON.parse(cartItems);

    if(cartItems != null){
        if ((discountCode[0] == promocode.toLowerCase()) && ((subTotal < 150) || (subTotal > 199))){
            alert("disc10 is only applicable where Sub Total is between R150 and R199.");
        } else if((discountCode[1] == promocode.toLowerCase()) && (subTotal < 200)){
            alert("disc15 is only applicable where Sub Total is R200 or more.");
        } else if ((discountCode[0] == promocode.toLowerCase()) && (subTotal > 149) && (subTotal < 200)){
            finalDiscount = subTotal * 0.1;
            alert("Coupon disc10 applied");       
        } else if ((discountCode[1] == promocode.toLowerCase()) && (subTotal > 199)) {
            finalDiscount = subTotal * 0.15;
            alert("Coupon disc15 applied");
        } else //if (discountCode.includes(promocode.toLowerCase()) != true) 
        {
            finalDiscount = 0;
            alert("Invalid coupon.");        
        }
    } else if(cartItems === null){
        finalDiscount = 0;
    }
    localStorage.setItem("finalDiscount", finalDiscount);
    
    onLoadCartNumbers();
    displayCart();
    location.reload();
}

$(document).ready(function(){

    //let finalDiscount = 0;
    
    //Function to check sub-total and apply discount coupon
    // $('#applyCoupon').click(function(){
       
    //     let promocode = $('#in').val();
    //     let subTotal = parseFloat(document.getElementById('subTotal').innerHTML);
    //     let discountCode = ['disc10','disc15'];
    //     let cartItems = localStorage.getItem('productsInCart'); 
    //     cartItems = JSON.parse(cartItems);

    //     if(cartItems != null){
            
    //         if ((discountCode[0] == promocode.toLowerCase()) && (subTotal < 150) && (subTotal > 199)){
    //             alert("disc10 is only applicable where Sub Total is between R150 and R199.");
    //         } else if((discountCode[1] == promocode.toLowerCase()) && (subTotal < 200)){
    //             alert("disc15 is only applicable where Sub Total is R200 or more.");
    //         } else if ((discountCode[0] == promocode.toLowerCase()) && (subTotal > 149) && (subTotal < 200)){
    //             finalDiscount = subTotal * 0.1;
    //             alert("Coupon disc10 applied");       
    //         } else if ((discountCode[1] == promocode.toLowerCase()) && (subTotal > 199)) {
    //             finalDiscount = subTotal * 0.15;
    //             alert("Coupon disc15 applied");
    //         } else //if (discountCode.includes(promocode.toLowerCase()) != true) 
    //         {
    //             finalDiscount = 0;
    //             alert("Invalid coupon.");        
    //         }
    //     } else if(cartItems === null){
    //         finalDiscount = 0;
    //     }
    //     localStorage.setItem("finalDiscount", finalDiscount);
        
    //     onLoadCartNumbers();
    //     displayCart();
    //     location.reload();
    // });

    //Function to reset the discount value whenever the sub-total value changes
    $(".increase, .decrease, .deleteBtn").click(function(){
        localStorage.setItem("finalDiscount", 0);
        displayCart();
    });

    //Clicking the collection radio button will reset shipping value to zero
    $("#collect").click(function(){
        $("select").hide();
        localStorage.setItem("shipping", 0);
        displayCart();
        location.reload();
    });
    
    //Function to show delivery/shipping options
    $("#deliver").click(function(){
        $("select").show();
    });
    
    //Function to set the shipping value based on the user's choice
    $("select").change(function(){
        let str = "";
        $("select option:selected").each(function() {
            str = $(this).val();
        });
        localStorage.setItem("shipping", str);
        location.reload();
    });

        
    $("#2packVests").mouseenter(function(){
        $("#2packVestsPromo").animate({
            width: "100%"},
            {queue: false,
            duration: 1000})
            .animate({fontSize: "24px"}, 1000)
            .animate({borderRightWidth: "15px"}, 1000);
    });

    $("#2packVests").mouseleave(function(){
        $("#2packVestsPromo").animate({fontSize: "18px"}, 600)
        .animate({width: "30%"}, 1000)
    });

    $("#embroideryTop").mouseenter(function(){
        $("#embroideryTopPromo").animate({
            width: "100%"},
            {queue: false,
            duration: 1000})
            .animate({fontSize: "24px"}, 1000)
            .animate({borderRightWidth: "15px"}, 1000);
    });

    $("#embroideryTop").mouseleave(function(){
        $("#embroideryTopPromo").animate({fontSize: "18px"}, 600)
        .animate({width: "30%"}, 1000)
    });

    //Generating order reference number by converting current date to string
    var GenRandom =  {
	
        Stored: [],
        
        Job: function(){
            var newId = Date.now().toString();
            
            if( !this.Check(newId) ){
                this.Stored.push(newId);
                return newId;
            }
            
            return this.Job();
        },
        
        Check: function(id){
            for( var i = 0; i < this.Stored.length; i++ ){
                if( this.Stored[i] == id ) 
                return true;
            }
            return false;
        }  
    };
    
    $("#confirmOrder").click(function(){
            $('#refNum').append(GenRandom.Job());
            alert("Order successful!!");
    });

});

//Function to display the cart
function displayCart() {
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);

    let cart = parseFloat(localStorage.getItem("totalCost"));
    
    let finalDiscount = parseFloat(JSON.parse(localStorage.getItem('finalDiscount'))); 
    if (isNaN(finalDiscount))
        finalDiscount = 0;

   let shippingCost = parseFloat(localStorage.getItem('shipping'));
   if (isNaN(shippingCost))
        shippingCost = 0;

    // VAT calculation
    let vat = 0.15 * ((cart - finalDiscount) + shippingCost);

    //Basket total including shipping costs and VAT
    let cartTotal = (cart - finalDiscount) + shippingCost + vat;

    let productContainer = document.querySelector('.products');
    
    if( cartItems && productContainer ) {
        productContainer.innerHTML = '';
        Object.values(cartItems).map( (item, index) => {
            productContainer.innerHTML += 
            `<div class="product">
                <ion-icon class="deleteBtn" name="close-circle"></ion-icon>
                <img src="./images/${item.tag}.jpg">
                <span class="sm-hide">${item.name}</span>
            </div>
            <div class="price sm-hide">${item.price}</div>
            <div class="quantity">
                <ion-icon class="decrease" name="arrow-dropleft-circle"></ion-icon>
                <span>${item.inCart}</span>
                <ion-icon class="increase" name="arrow-dropright-circle"></ion-icon>   
            </div>
            <div class="total">${item.inCart * item.price}</div>`;
        });

        productContainer.innerHTML += `
            <div class="basketTotalContainer">
                <form onsubmit="" class="card-body"> 
                    <input type="text" name="coupon" id="in" class="coupon" title="Enter code" placeholder="Coupon code">
                    <input id="applyCoupon" class="btnCoupon" onclick="applyDiscount()" type="button" value="APPLY COUPON" />
                </form>

                <h5 class="basketTotalTitle" style="color: blue;">Sub Total</h5>
                <h5 class="vatTotal" id="subTotal">${parseFloat(cart).toFixed(2)}</h5>
            </div>

            <div class="basketTotalContainer">
                <div class="shippingType">    
                    <div class="radioBtns">
                        <label>Collection or Delivery:</label>
                        <label for="collection">
                            <input type="radio" id="collect" name="shippingOption" >
                            Collection
                        </label>
                        <label for="delivery">
                            <input type="radio" id="deliver" name="shippingOption" >
                            Delivery
                        </label>
                        <select id="delOption" style="display: none">
                            <option value="0">select option</option>
                            <option value="10">Budget - R10.00</option>
                            <option value="15">Standard - R15.00</option>
                            <option value="20">Express - R20.00</option>
                        </select>
                    </div>
                </div>

                <h5 class="basketTotalTitle" style="color: red;">Discount</h5>
                <h5 class="vatTotal" id="myDiscount" style="color: red;">(${parseFloat(finalDiscount).toFixed(2)})</h5>
            </div>

            <div class="basketTotalContainer">
                <h5 class="basketTotalTitle" style="color: blue;">Shipping</h5>
                <h5 class="vatTotal">${shippingCost.toFixed(2)}</h5>
            </div>

            <div class="basketTotalContainer"> 
                <h5 class="basketTotalTitle" style="color: blue;">VAT</h5>
                <h5 class="vatTotal">${vat.toFixed(2)}</h5>
            </div>
            
            <div class="basketTotalContainer">
                <h4 class="basketTotalTitle">Basket Total</h4>
                <h4 class="basketTotal">${cartTotal.toFixed(2)}</h4>
            </div>
            
            <div class="basketTotalContainer">
                <output>Order Reference : </output>
                <output id="refNum"></output>
                <input id="confirmOrder" class="btnConfirmOrder" type="button" value="CONFIRM ORDER" />
            </div>`

        deleteButtons();
        manageQuantity();
    } 
}

//Function to add or decrease item quantities in cart
function manageQuantity() {
    let decreaseButtons = document.querySelectorAll('.decrease');
    let increaseButtons = document.querySelectorAll('.increase');
    let currentQuantity = 0;
    let currentProduct = '';
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);

    for(let i=0; i < increaseButtons.length; i++) {
        decreaseButtons[i].addEventListener('click', () => {
            console.log(cartItems);
            currentQuantity = decreaseButtons[i].parentElement.querySelector('span').textContent;
            console.log(currentQuantity);
            currentProduct = decreaseButtons[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent.replace(/ /g,'').trim();
            console.log(currentProduct);

            if( cartItems[currentProduct].inCart > 1 ) {
                cartItems[currentProduct].inCart -= 1;
                cartNumbers(cartItems[currentProduct], "decrease");
                totalCost(cartItems[currentProduct], "decrease");
                localStorage.setItem('productsInCart', JSON.stringify(cartItems));
                displayCart();
            } 
        });

        increaseButtons[i].addEventListener('click', () => {
            console.log(cartItems);
            currentQuantity = increaseButtons[i].parentElement.querySelector('span').textContent;
            console.log(currentQuantity);
            currentProduct = increaseButtons[i].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent.replace(/ /g,'').trim();
            console.log(currentProduct);
            
            cartItems[currentProduct].inCart += 1;
            cartNumbers(cartItems[currentProduct]);
            totalCost(cartItems[currentProduct]);
            localStorage.setItem('productsInCart', JSON.stringify(cartItems));
            displayCart();
        });
    }
}

//Function for delete buttons on cart page
function deleteButtons() {
    let deleteButtons = document.querySelectorAll('.product ion-icon');
    let productNumbers = localStorage.getItem('cartNumbers');
    let cartCost = localStorage.getItem("totalCost");
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);
    let productName;
    console.log(cartItems);

    for(let i=0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener('click', () => {
            productName = deleteButtons[i].parentElement.textContent.replace(/ /g,'').trim(); 
           
            localStorage.setItem('cartNumbers', productNumbers - cartItems[productName].inCart);
            localStorage.setItem('totalCost', cartCost - ( cartItems[productName].price * cartItems[productName].inCart));

            delete cartItems[productName];
            localStorage.setItem('productsInCart', JSON.stringify(cartItems));

            if(JSON.parse(localStorage.getItem("totalCost")) == 0){
                localStorage.setItem("shipping", 0);
                localStorage.setItem("finalDiscount", 0);
            };

            displayCart();
            onLoadCartNumbers();
            alert("Current Total (incl. VAT) is: R" + (JSON.parse(localStorage.getItem("totalCost") * 1.15).toFixed(2)));
        })
    }
}

onLoadCartNumbers();
displayCart();
