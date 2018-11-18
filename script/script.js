let pageNum = 1;
let request = new XMLHttpRequest();
let data;
let map = new Map();
let temp = document.querySelector('#cat-temp');
let plate = document.querySelector(".cats_plate");
let shoppingCart = document.querySelector(".shopping-cart");
let drpBtn = document.querySelector("#myDropdown");
let storage = window.localStorage;
let cartStorage = new Map();

window.onload = function () {
    addNewCatsFromApi()
};

function createMapForCats(cats) {
    cats.forEach(e => map.set(e.id, e));
}

function addNewCatsFromApi() {
    request.open('GET', `https://ma-cats-api.herokuapp.com/api/cats?page=${pageNum++}&per_page=50`, true);

    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            data = JSON.parse(request.responseText);
            createMapForCats(data.cats);
            createCats(data.cats);
        } else {
            throw new Error(`Something went wrong ${request.status}`);
        }
    };
    request.send();
}


function checkShoppingCart(id) {
    if (cartStorage.size > 0) {
        let toCheck = cartStorage.get(id);
        if (toCheck !== null) {

        }
    }
}

let cartItemTemplate = document.querySelector('#shopping-cart-template');

function addItemToCart(id) {
    let item = map.get(id);
    let cartTemplate = document.importNode(cartItemTemplate.content, true);
    let quantity = cartTemplate.querySelector(".quantity");
    let price = cartTemplate.querySelector(".cart-price");
    let img = cartTemplate.querySelector(".cat-img");

    // price.setAttribute("value", item.price);
    price.innerHTML = "Price: " + item.price;
    quantity.setAttribute("value", " 1");
    img.setAttribute('src', item.img_url);
    saveItemToLocalStorage(item.id, cartTemplate);
    shoppingCart.appendChild(cartTemplate);
    checkShoppingCart();
}

function saveItemToLocalStorage(key, value) {

    let item = storage.getItem(key);
    if (item !== null) {
        storage.setItem(key, value.id);
    } else {
        let arr = [];
        arr.push(value);
        storage.setItem(key, value.id);
    }
}

function createCats(arr) {
    for (let i = 0; i < arr.length; i++) {
        let card = document.importNode(temp.content, true);
        let priced = card.querySelector(".price");
        let img = card.querySelector(".img");
        let cart = card.querySelector(".cart");
        priced.innerHTML = arr[i].price;
        img.setAttribute('src', arr[i].img_url);
        cart.id = arr[i].id;
        cart.addEventListener("click", e => {
            let id = Number(e.target.id);
            addItemToCart(id);
            // shoppingCart.push(catToCart);
            // checkShoppingCart();
        });
        plate.appendChild(card);
    }
}

// window.onscroll = function () {
//     addCatsOnScroll()
// };


//======== Modal ===============

let modal = document.querySelector(".modal");
let openModal = document.querySelector(".modal-btn");
let closeModal = document.querySelector(".close");

openModal.onclick = () => modal.style.display = "block";
closeModal.onclick = () => modal.style.display = "none";
window.onclick = e => {
    if (e.target === modal) {
        modal.style.display = "none";
    }

    if (e.target === dropBtn) {
        dropBtn.style.display = "none";
    }
};

function dropBtn() {
    drpBtn.style.display = "block";
}


function addCatsOnScroll() {
    if (document.body.scrollTop > 1000 || document.documentElement.scrollTop > 350) {
        addNewCatsFromApi();
    }
}

// document.querySelector('.js-addCat').addEventListener('click', createCats);