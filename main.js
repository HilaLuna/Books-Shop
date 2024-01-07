let bookList = []

//todo toggle menu
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

//
const createBookItemsHtml = () => {
    const bookListEl = document.querySelector(".book_list")
    //console.log(bookListEl)

    let bookListHtml = ""
    bookList.forEach((book, index) => { /* aşağıdaki yapıda sadece = koyarsak tek bir kitabı içine aktarır ama += dersek forEach döngüsüyle dönerek tüm kitapları dönerek içine aktarır. */
        console.log(book)
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
                        <i class="bi bi-star-fill active"></i>
                        <i class="bi bi-star-fill"></i>
                        <i class="bi bi-star-fill"></i>
                        <i class="bi bi-star-fill"></i>
                        <i class="bi bi-star-fill"></i> <br>
                        <span class="gray">1938 reviews</span>
                    </span>
                </div>
                <p class="book_description fos gray">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nesciunt
                    doloribus adipisci eum eveniet nobis illo placeat maiores rerum nihil corrupti.</p>
                    <div>
                        <span class="black fw-bold fs-4 me-2">45tl</span>
                        <span class="fs-4 fw-bold old_price">65tl</span>
                    </div>
                    <button class="btn_purple">Sepete Ekle</button>
            </div>
        </div>
    </div>` 
    })
    bookListEl.innerHTML = bookListHtml
}
//createBookItemsHtml()
//datanın gelmesini bekledik, gelmeyince setTimeout'la getirdik ki tüm kitapları booklist'in içinde görelim.
setTimeout(() => {
    getBooks()
    createBookItemsHtml()
}, 200);