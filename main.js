let bookList = [],
    basketList = []

//todo "toggle menu"
const toggleModal = () => {
    const basketModal = document.querySelector(".basket_modal")
    //console.log(basketModal)
    basketModal.classList.toggle("active") /*bir şeyi ekleyip çıkarmak için toggle
    kullandık ama sepet işaretine tıkladığımızda sağdaki sepete kitap eklenen kısmın açılabilmesi
    için html kısmında basket_icon kısmına onclick verdik. */
}

const getBooks = () => {
    fetch("./products.json")
    .then((res) =>res.json())
   /* .then((books) =>console.log(books)) bunu konsola yazdırmak yerine bookList'e nasıl aktarırız.Şöyle... */
    .then((books) => (bookList = books)) /*extradan json parse veya appendChild dememize gerek kalmadan bookList'i buraya ekleyerek içine tüm kitapları getirttik.*/
    .catch((err) =>console.log(err))
}
getBooks()

//todo "Dinamik yıldızlar oluşturduk"
const createBookStars = (starRate) =>{
    //console.log(starRate)
    let starRateHtml = ""
    for(let i = 1;i <=5;i++){
        if(Math.round(starRate) >=i){
            starRateHtml +=`<i class="bi bi-star-fill active"></i>`
        }else{
            starRateHtml += `<i class="bi bi-star-fill"></i>`
        }
    }
    return starRateHtml //!bunu yazmasaydık, yıldızları sayfada göremiyorduk.
}
//todo "html oluşturduk ve içine kitaplarımızı gönderdik
const createBookItemsHtml = () => {
    const bookListEl = document.querySelector(".book_list")
    //console.log(bookListEl)

    let bookListHtml = ""
    bookList.forEach((book, index) => { /* aşağıdaki yapıda sadece = koyarsak tek bir kitabı içine aktarır ama += dersek forEach döngüsüyle dönerek tüm kitapları dönerek içine aktarır. */
        //console.log(book)
        /*Aşağıda bookListHtml'in yanına += eklememizin sebebi bir kitabı ekleyip sonra sırasıyal diğer
        kitapları eklemesini istememiz. Sadece = olursa tek bir item ekler, o da en sondaki kitap olur.*/
        bookListHtml += `
        <div class="col-5 ${index % 2 == 0 && "offset-2"} my-5"> 
        <div class="row book_card">
            <div class="col-6">
                <img src='${book.imgSource}' 
                alt="" class="img-fluid shadow" width="258px" height="400px"/>
            </div>
            <div class="col-6 d-flex flex-column justify-content-center gap-4">
                <div class="book_detail">
                    <span class="fos gray fs-5">${book.author}</span> <br>
                    <span class="fs-4 fw-bold">${book.name}</span> <br>
                    <span class="book_star-rate">
                      ${createBookStars(book.starRate)}
                        <span class="gray">1938 reviews</span>
                    </span>
                </div>
                <p class="book_description fos gray">
                ${book.description}
                </p>
                    <div>
                        <span class="black fw-bold fs-4 me-2">${book.price}tl</span>
                        <span class="fs-4 fw-bold old_price">${book.oldPrice ? `<span class="fs-4 fw-bold old_price">${book.oldPrice}tl</span>` : ""}</span> 
                    </div>
                    <button class="btn_purple" onClick="addBookToBasket(${book.id
                    })">Sepete Ekle</button>
            </div>
        </div>
    </div>` 
    })
    bookListEl.innerHTML = bookListHtml
}
//createBookItemsHtml()


const BOOK_TYPES ={
    ALL:"Tümü",
    NOVEL:"Roman",
    CHILDREN:"Çocuk",
    HISTORY:"Tarih",
    FINANCE:"Finans",
    SCIENCE:"Bilim",
    SELFIMPROVEMENT:"Kişisel Gelişim",
}
const createBookTypesHtml = () =>{
    const filterEle = document.querySelector(".filter")
    let filterHtml = ""
    //filtre türlerini tutacak dizi, "ALL" türüyle başlatılmıştır. 
    let filterTypes = ["ALL"]
    bookList.forEach((book) => {
        //eğer filtre türleri dizisinde bu tür bulunmuyorsa ekleme işlemi yapar.
        if(filterTypes.findIndex((filter) => filter == book.type) == -1){
            filterTypes.push(book.type)
    }
    })
        //!findIndex metodu bir dizi içinde belirli bir koşul sağlayan ilk öğenin indexini bulmak için kullanıyoruz.
        //console.log(book)
        filterTypes.forEach((type,index)=>{
            //console.log(type)
            filterHtml += ` <li onClick="filterBooks(this)" data-types="${type}" class="${index == 0 ? "active" : null }">${BOOK_TYPES[type] || type} </li>`
        })
    
    filterEle.innerHTML = filterHtml 
}
const filterBooks =(filterEl)=>{
    //console.log(filterEl)
    document.querySelector(".filter .active").classList.remove("active")
    filterEl.classList.add("active")
    let bookType = filterEl.dataset.types
    //console.log(bookType)
    getBooks()
    if(bookType != "ALL") { //eğer booktype'ın içindeki ALL'a eşit değilse
        bookList = bookList.filter((book) => book.type == bookType)
    }
        createBookItemsHtml()
}

const listBasketItems =()=>{
    const basketListEl = document.querySelector(".basket_list")
    const basketCountEl =document.querySelector(".basket_count")
    //basketCountEl.innerHTML = basketList.length > 0 ? basketList.reduce() : null //!Hoca bunu sildi
    const totalQuantity =basketList.reduce((total,item) => total + item.quantity, 0
    )
    basketCountEl.innerHTML = totalQuantity > 0 ? totalQuantity : null
    const totalPriceEl = document.querySelector(".total_price")
    //console.log(totalPriceEl)
    let basketListHtml = ""
    let totalPrice = 0
    basketList.forEach((item)=>{
        console.log(item)
        totalPrice += item.product.price * item.quantity
        basketListHtml += `
        <li class="basket_item">
                    <img src="${item.product.imgSource}" 
                        alt="" width="100" height="100">
                    <div class="basket_item-info">
                        <h3 class="book_name">${item.product.name}</h3>
                        <span class="book_price">${item.product.price}tl</span><br>
                        <span class="book_remove" onClick="removeItemBasket(${item.product.id})">Sepetten Kaldır</span>
                    </div>
                    <div class="book_count">
                        <span class="decrease" onClick="decreaseItemToBasket(${item.product.id})">-</span>
                        <span class="mx-2">${item.quantity}</span>
                        <span class="increase" onClick="increaseItemToBasket(${item.product.id})">+</span>
                    </div>
                </li>
        `
    })
    basketListEl.innerHTML = basketListHtml ? basketListHtml : `<li class="basket_item">Sepette herhangi bir ürün bulunmuyor.
    Sepete ürün ekleyiniz. </li> `
    totalPriceEl.innerHTML = totalPrice > 0 ? "Total:" + totalPrice + "tl" : null
    
}
//sepete ürün ekleme
const addBookToBasket = (bookId) => {
    //console.log(bookId)
    let foundBook = bookList.find((book) => book.id == bookId
    )
    //console.log(foundBook)
    if(foundBook){
        //sepetteki ürünün zaten var olup olmadığını kontrol ettik
        const basketAlreadyIndex = basketList.findIndex(
            (basket) => basket.product.id == bookId
            )
            //eğer sepet boşsa veya eklenen kitap sepette yoksa bu kısım çalışacak
            if(basketAlreadyIndex == -1){ //hiçbir eleman eklenmediyse anlamına geliyor -1
                let addItem = {quantity: 1, product:foundBook}
                basketList.push(addItem)
            }else {
                //sepette zaten var olan bir kitap ekleniyorsa, miktarını artır
                basketList[basketAlreadyIndex].quantity+= 1
                //console.log(basketList)
            }

    }
    const btnCheck = document.querySelector(".btnCheck")
    //console.log(btnCheck)
    btnCheck.style.display = "block"
    //sepet içeriğini güncelle ve görüntüle
    listBasketItems()
}
//sepetten ürünü kaldırır
const removeItemBasket = (bookId) => {
const foundIndex = basketList.findIndex(
    (basket) => basket.product.id == bookId
    )
    //eğer kitap sepet içinde bulunuyorsa
    if(foundIndex != -1){
        //splice'ı belirli sayıda eleman silmek için kullandık
        //sepet listesinden kitabı çıkar
        basketList.splice(foundIndex, 1)
    }
    const btnCheck = document.querySelector(".btnCheck")
    //console.log(btnCheck)
    btnCheck.style.display = "block"
    //sepet içeriğini günceller
    listBasketItems()
}
//sepetteki ürünün miktarını azaltma
const decreaseItemToBasket =(bookId) => {
    //console.log(bookId)
    const foundIndex = basketList.findIndex(
        (basket) => basket.product.id == bookId
        )
        //eğer kitap sepet içinde bulunuyorsa
        if(foundIndex != -1){ //kitap sepetin içinde çünkü burda foundIndex -1'e eşit değilse diyoruz
            //eğer kitabın miktarı 1'den büyükse
            if(basketList[foundIndex].quantity != 1){ //burda sepetteki ürün 1 taneyse yanındaki eksiye bastığımızda 0'a düşeceği için otomatik sepetten kaldırıyor.
            basketList[foundIndex].quantity -= 1
            }else {
                removeItemBasket(bookId)
            }
            listBasketItems()
        }
        //sepet içeriğini güncelle
        listBasketItems()
}
//sepetteki miktarı artırır
const increaseItemToBasket = (bookId) => {
const foundIndex = basketList.findIndex(
    (basket)=>basket.product.id == bookId
    )
    //eğer kitap sepet içinde bulunuyorsa
    if(foundIndex != -1){
        //kitabın miktarını bir artır
        basketList[foundIndex].quantity += 1
    }
    //sepet içeriğini güncelledik
    listBasketItems()
} 

//datanın gelmesini bekledik, gelmeyince setTimeout'la getirdik ki tüm kitapları booklist'in içinde görelim.
setTimeout(() => {
    createBookItemsHtml()
    createBookTypesHtml()
}, 100);