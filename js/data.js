class dataPrices {

    constructor(produc, price, totalPrice) {
        this.price = price
        this.produc = produc
        this.totalPrice = totalPrice
    }

    getTotalPrice() {
        return this.totalPrice
    }

    getProduc() {
        return this.produc
    }

    getPrice() {
        return this.Price
    }

    setTotalPrice(price) {
        this.totalPrice += price
        return this.totalPrice
    }

    setProduc(produc) {
        this.produc = produc
    }

    setPrice(price) {
        this.price = price
    }

    minusPrice(price) {
        this.totalPrice -= price
        return this.totalPrice
    }
}


class payItems {
    dataPayments

    constructor() {
        this.dataPayments = []
    }

    setItem(json) {
        this.dataPayments.push(json)
    }

    getItem() {
        return this.dataPayments
    }

    dropItem(position) {
        this.dataPayments.splice(position, 1)
    }

    dropAll = () => this.dataPayments = []

    sumItems() {
        var jsonResult = { products: [], description: [], price: [], count: [], priceTotal: [] }
        this.dataPayments.forEach(json => {
            var ajustmentJson = JSON.parse(json)
            var pos = jsonResult.products.indexOf(ajustmentJson.product)
            if (pos < 0) {
                jsonResult.products.push(ajustmentJson.product)
                jsonResult.description.push(ajustmentJson.description)
                jsonResult.priceTotal.push(ajustmentJson.price)
                jsonResult.count.push(1)
                jsonResult.price.push(ajustmentJson.price)

            } else {
                jsonResult.priceTotal[pos] = jsonResult.priceTotal[pos] + ajustmentJson.price
                jsonResult.count[pos]++
            }
        })
        return jsonResult
    }
}

class insertDataFront {
    data = new dataPrices
    payItem = new payItems
    arrayProducts = []
    constructor() {
        this.data.price = 0
        this.data.produc = ''
        this.data.totalPrice = 0
        this.payItem.dataPayments = []
        this.arrayProducts = []
    }

    setTotal = (price) => {
        const total = document.getElementById('total')
        this.data.setTotalPrice(price)
        total.value = this.data.getTotalPrice()
    }

    setLista = () => {
        const products = document.getElementById('listProductos')
        products.innerHTML = ''

        for (let i = 0; i < this.payItem.dataPayments.length; i++) {
            var step = JSON.parse(this.payItem.dataPayments[i])
            products.innerHTML +=
                `
            <li class="dropdown-item">
                ${step.product} -- ${step.price} 
                <button type="button" class="btn btn-danger" onclick="dataFront.dropItem(${i},${step.price})">-</button>
            </li>
            `
        }
    }

    setPrice = (name) => {
        const pos = this.arrayProducts.name.indexOf(name)
        this.setTotal(this.arrayProducts.price[pos])
        this.payItem.setItem(JSON.stringify({ product: this.arrayProducts.name[pos], price: this.arrayProducts.price[pos], name: this.arrayProducts.name[pos], description: this.arrayProducts.description[pos] }))
        this.setLista()
    }

    buildCards = (id, arrayProd) => {
        this.arrayProducts = arrayProd
        const cards = document.getElementById(id)
        for (let i = 0; i < this.arrayProducts.price.length; i++) {
            cards.innerHTML += (
                `
                        <div class="card border-secondary mx-2 w-25">
                        <img class="card-img-top img-fluid" src="../img/${arrayProd.path[i]}" alt="Card image cap">
                            <div class="card-body text-secondary">
                                <h5 class="card-title">${arrayProd.name[i]}</h5>
                                <p class="card-text">${arrayProd.description[i]} - $ ${arrayProd.price[i]}</p>
                                <button type="button" class="btn btn-primary fixed-buttom" onclick="dataFront.setPrice('${arrayProd.name[i]}')">Añadir al carrito</button>
                            </div>
                        </div>
                    `
            )

        }
    }

    dropItem(position, price) {
        this.payItem.dropItem(position)
        this.data.minusPrice(price)
        this.setTotal(0)
        this.setLista()
        alertOK('Dato eliminado', 'OK')
    }


    returnList(){
        const tableItems = document.getElementById('update')
        tableItems.innerHTML = `<div class="row row-cols-1 row-cols-md-3 g-4" id="dataImages"></div>`
        this.buildCards('dataImages', productos, 12)
    }

    updateSpace() {
        const tableItems = document.getElementById('update')
        tableItems.innerHTML =
        `
        <div class="container mt-5">
        <h1>Listado de compras</h1>
        <div class="row row-cols-1 row-cols-md-3 g-4" id="buy-things">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Item</th>
                        <th scope="col">Producto</th>
                        <th scope="col">Descripcion</th>
                        <th scope="col">Precio Unitario</th>
                        <th scope="col">Total Unidades</th>
                        <th scope="col">Total x Produc</th>
                    </tr>
                </thead>
                <tbody id="dataItems">
                </tbody>
            </table>
            <botton type="button" class="btn btn-secondary btn-sm me-5" onclick="dataFront.payment()"  id="Carrito" >Pagar</botton>
            <botton type="button" class="btn btn-danger btn-sm me-5" onclick="dataFront.returnList()" id="Carrito" >Cancelar</botton>
        </div>
        </div>
        `
    }

    upData() {
        this.updateSpace()
        var producsPaymen = this.payItem.sumItems()
        const tableItems = document.getElementById('dataItems')
        for (let i = 0; i < producsPaymen.products.length; i++) {
            tableItems.innerHTML +=
                `
        <tr>
            <th scope="row">${i+1}</th>
                <td>${producsPaymen.products[i]}</td>
                <td>${producsPaymen.description[i]}</td>
                <td>${producsPaymen.price[i]}</td>
                <td>${producsPaymen.count[i]}</td>
                <td>${producsPaymen.priceTotal[i]}</td>
        </tr>
        `
        }
    }

    payment(){
        alertOK('Ya pagaste','OK')
        this.payItem.dropAll()
        this.setLista()
        this.returnList()
        document.getElementById('total').value = 0
    }


}

alertOK = (message, tipe) => {
    switch (tipe) {
        case "OK":
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: message,
                showConfirmButton: false,
                timer: 1500
            })
            break;
        case "ERR":
            Swal.fire({
                icon: 'Error',
                title: 'Oops...',
                text: message,
            })
            break;
        default:
            alert("Tipo de error no seleccionado")
    }
}

const dataFront = new insertDataFront

const productos = {
    name: ["Gaseosa", "Cerveza", "Carnes Res", "Carnes Cerdo", "Carnes Pez", "Pasta", "Salsa Tomate", "Salsa Blanca", "Sal", "Azucar", "Pimienta", "Granos"],
    description: ["Gaseosas de tipo dulce", "Rojas, negras, doradas", "T-Bone", "Carnitas", "Carpacho", "Pasta Tornillo", "Salsa Tomate", "Salsa Blanca", "Sal Gruesa", "Azucar Blanca", "Negra, Roja", "Granos"],
    price: [2500, 3600, 12000, 11500, 15000, 7600, 5000, 5500, 2500, 3200, 3300, 6200],
    path: ["Img_prod_1.jpg", "Img_prod_2.jpg", "Img_prod_3.jpg", "Img_prod_4.jpg", "Img_prod_5.jpg", "Img_prod_6.jpg", "Img_prod_7.jpg", "Img_prod_8.jpg", "Img_prod_9.jpg", "Img_prod_10.jpg", "Img_prod_11.jpg", "Img_prod_12.jpg"],
}

dataFront.buildCards('dataImages', productos)
