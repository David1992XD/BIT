card = document.getElementById("card-data")
pageCurrency = 0
page = [1, 2, 3]

async function linkData(link) {
    let pagesApi = link
    let pokemon = await fetch(pagesApi)
    return pokemon
}
async function apiPokemon(name) {
    pokemonData = await linkData('https://pokeapi.co/api/v2/pokemon/' + name + '/')
    return pokemonData
}

async function apiEvolution(id) {
    pokemonData = await linkData('https://pokeapi.co/api/v2/evolution-chain/' + id + '/')
    return pokemonData
}

async function pageData(items, start) {
    let pokemon = await linkData('https://pokeapi.co/api/v2/evolution-chain/?limit=' + items + '&offset=' + start)
    return pokemon
}

async function listEvolutionData(id) {
    let pokemon = apiEvolution(id)
    let listEvolution = []
    try {
        await pokemon.then(valor => valor.json())
            .then(item => {
                if (item.chain.evolves_to.length !== 0) {
                    listEvolution.push(item.chain.evolves_to[0].species.name)
                }

                if (item.chain.evolves_to[0].evolves_to.length !== 0) {
                    listEvolution.push(item.chain.evolves_to[0].evolves_to[0].species.name)
                }
            })
        return listEvolution
    } catch {
        listEvolution.push('Desconocido/No Existe')
        return listEvolution
    }

}


async function createCarruselPokemon(id) {
    let textEvolution = ''
    let name = ''
    try {
        await listEvolutionData(id).then(pokeEvolucion => {
            if (pokeEvolucion[0] !== 'Desconocido/No Existe') {
                pokeEvolucion.forEach((item, i) => {
                    apiPokemon(item)
                        .then(pokeEvoDescri => pokeEvoDescri.json())
                        .then(image => {
                            let imgURL = image.sprites.other["official-artwork"].front_default
                            if (textEvolution === '') {
                                textEvolution =
                                    `
                            <div class="carousel-item active">
                                <img src="${imgURL}" class="d-block w-100">
                                <div class="carousel-caption d-none d-md-block">
                                    <h5 class="text-wrap bg-primary text-uppercase">${i + 1} - ${item}</h5>
                                </div>
                            </div>
                            `
                            } else {
                                textEvolution +=
                                    `
                            <div class="carousel-item">
                                <img src="${imgURL}" class="d-block w-100">
                                <div class="carousel-caption d-none d-md-block">
                                    <h5 class="text-wrap bg-primary text-uppercase">${i + 1} - ${item}</h5>
                                </div>
                            </div>
                            `
                            }

                            modalPoke = document.querySelector('.carousel-inner')
                            modalPoke.innerHTML = textEvolution
                        })
                })
            } else {
                listEvolutionData(id).then(pokeEvolucion => {
                    textEvolution =
                        `
                        <div class="carousel-item active">
                            <img src="https://elvortex.com/wp-content/uploads/2018/03/HddtBOT-e1520478229723.png" class="d-block w-100">
                            <div class="carousel-caption d-none d-md-block">
                                <h5 class="text-wrap bg-primary text-uppercase"> 1 - ${pokeEvolucion}</h5>
                            </div>
                        </div>
                        `
                    modalPoke = document.querySelector('.carousel-inner')
                    modalPoke.innerHTML = textEvolution
                })
            }

        })
    } catch (error) {
        console.log(error.message)
    }

}

async function activateModal(id) {
    modalPoke = document.querySelector('.carousel-inner')
    modalPoke.innerHTML = ''
    await createCarruselPokemon(id)
    modalPoke = document.querySelector('#modalPokeShow')
    const modal = new bootstrap.Modal(modalPoke.querySelector('.modal'))
    modal.show()
}

const addData = (link) => {
    let id = ''
    let name = ''
    let text = ''
    chain = fetch(link)

    chain.then(valor => valor.json())
        .then(item => {
            name = item.chain.species.name
            id = item.id
            apiPokemon(name).then(pokeDescri => pokeDescri.json())
                .then(pokeLike => {
                    let arrayAbilities = Object.values(pokeLike)[0]
                    arrayAbilities.forEach(value => {
                        text +=
                            `
                            <li class="list-group-item list-group-item-success">${value.ability.name}</li>                               
                            `
                    })
                    let imgURL = pokeLike.sprites.other["official-artwork"].front_default
                    card.innerHTML +=
                        `
                        <div id="${name}" class="card col" style="width: 18rem;">
                        <img class="card-img-top" src="${imgURL}" alt="Card image cap">
                            <div class="card-body">
                                <h5 class="card-title text-white">${name}</h5>
                                <p class="card-text text-white">Habilidades
                                    <ul class="list-group list-group-numbered">
                                    ${text}
                                    </ul>
                                </p>
                                <button type="button" class="btn btn-primary" onclick="activateModal(${id})">Evolution</button>
                            </div>
                        </div>
                        `
                })
        })
}


const getData = (pageArray) => {
    updatePage(pageArray)
    return new Promise((resolve, reject) => {
        pageData(20, pageCurrency).then(valor => valor.json())
            .then(items => {
                arrayPokemon = Object.values(items)
                arrayPokemon[3].forEach(card => {
                    resolve = addData(card.url)
                })
            })
            .catch(err => {
                console.log(err.message)
                reject = err.message
            })
    })
}

updatePage = (array) => {
    let text=''
    array.forEach(item => {
        if(text===''){
            text =  `<li class="page-item active"><a class="page-link">${item}</a></li>`
        }else{
            text += `<li class="page-item"><a class="page-link" onclick="buttonSpecific(${item})">${item}</a></li>`
        }
    })

    managePage = document.getElementById("pagination")

    if (array[0] === 1) {
        managePage.innerHTML=
        `
        <nav aria-label="...">
                <ul class="pagination">
                    <li class="page-item disabled">
                        <a class="page-link" onclick="previewPage()">Previous</a>
                    </li>
                        ${text}
                    <a class="page-link" onclick="nextPage()">Next</a>
                    </li>
                </ul>
            </nav>
        `
    }else{
        managePage.innerHTML=
        `
        <nav aria-label="...">
                <ul class="pagination">
                    <li class="page-item">
                        <a class="page-link" onclick="previewPage()">Previous</a>
                    </li>
                        ${text}
                    <a class="page-link" onclick="nextPage()">Next</a>
                    </li>
                </ul>
            </nav>
        `
    }
}

nextPage = () => {
        card = document.getElementById("card-data")
        let newPage = []
        card.innerHTML = ''
        pageCurrency += 20
        page.forEach(plus => newPage.push(plus + 1))
        page = newPage
    if (page[0] < 24) {
        getData(page)
    } if(page[0] === 24) {
        let newPage = ['24','25']
        getData(newPage)
    }if(page[0] === 25) {
        let newPage = ['25']
        getData(newPage)
    }
        console.log(pageCurrency)
}

previewPage = () => {
    card = document.getElementById("card-data")
    card.innerHTML = ''
    let newPage = []
    
    pageCurrency -= 20
    page.forEach(plus => newPage.push(plus - 1))
    page = newPage
    getData(page)
}

buttonSpecific=(pos)=>{
    card = document.getElementById("card-data")
    card.innerHTML = ''
    posReal = pos
    pageCurrency = 20*(pos-1)
    let newPage = [pos,pos+1,pos+2]
    page = newPage
    getData(page) 
}




getData(page).then(item => console.log(item))

