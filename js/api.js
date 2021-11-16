card = document.getElementById("card-data")
 

addModal = (array, title) => {
    array.forEach(element => {
        pokeEvolution = 'https://pokeapi.co/api/v2/pokemon/' + element + '/'
        pokeDataEvolution = fetch(pokeEvolution)
        pokeDataEvolution.then(evolution => evolution.json())
            .then(dataEvo => {
                let imgURL = dataEvo.sprites.other["official-artwork"].front_default
                card.innerHTML +=
                    `
                <div class="modal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${title} title</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div id="carouselExampleSlidesOnly" class="carousel slide" data-bs-ride="carousel">
                        <div class="carousel-inner" id="dataEvolucionModal">
                        <div class="carousel-item active">
                            <img src="${imgURL}" class="d-block w-100" alt="...">
                        </div>
                        </div>
                    </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Save changes</button>
                    </div>
                    </div>
                </div>
                </div>
                `
            })
    })
}

showCard = (valor) => {
    
    let listEvolution = []
    let addModal = ''
    apiLink = valor
    let text = ''
    let modalPoke = null
    pokemon = fetch(apiLink)
    debugger
    pokemon.then(valor => valor.json())
        .then(item => {
            console.log(item.chain.evolves_to[0].species.name)
            if (item.chain.evolves_to.length !== 0) {
                listEvolution.push(item.chain.evolves_to[0].species.name)
            }

            if (item.chain.evolves_to[0].evolves_to.length !== 0) {
                listEvolution.push(item.chain.evolves_to[0].evolves_to[0].species.name)
            }
            console.log(listEvolution)
    
            listEvolution.forEach(element => {
                let apiDescription = 'https://pokeapi.co/api/v2/pokemon/' + element + '/'
                let pokemonData = fetch(apiDescription)
                
                pokemonData.then(pokemon => pokemon.json())
                    .then(pokemonData => {
                        
                        let imgURL = pokemonData.sprites.other["official-artwork"].front_default
                        text +=
                        `
                        <div class="carousel-item">
                        <img src="${imgURL}" class="d-block w-100">
                        </div>
                        `
                        modalPoke = document.querySelector('.carousel-inner')
                        modalPoke.innerHTML=
                        `                                            
                        ${text}
                        `
                    })
            });
            
        })
}


addData = (link) => {
    let names = []
    let name = ''
    let text = ''
    let jsonData = {}
    apiLink = link
    pokemon = fetch(apiLink)
    try {
        pokemon.then(valor => valor.json())
            .then(item => {
                name = item.chain.species.name
                let apiPoke = item.chain.species.url
                pokemonData = fetch(apiPoke)
                pokemonData.then(valor2 => valor2.json())
                    .then(item2 => {
                        let apiDescription = 'https://pokeapi.co/api/v2/pokemon/' + name + '/'
                        pokemonData2 = fetch(apiDescription)
                        pokemonData2.then(pokeDescri => pokeDescri.json())
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
                                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#pokeModal" onclick="showCard('${link}')">Evolution</button>
                                    </div>
                                    </div>
                                    `
                            })

                    })
            })
    } catch (error) {
        console.log(error.message)
    }

    return names
}
/**/

pageData = (items, start) => {
    arrayPokemon = ''
    pagesApi = 'https://pokeapi.co/api/v2/evolution-chain/?limit=' + items + '&offset=' + start
    pokemon = fetch(pagesApi)
    pokemon.then(valor => valor.json())
        .then(items => {
            let cap = items
            arrayPokemon = Object.values(cap)
            arrayPokemon = arrayPokemon[3]
            arrayPokemon.forEach(pokedata = (pokedata, i) => {
                addData(pokedata.url)
            });
        })
}

pageData(20, 0)




/*listEvolution.forEach(element => {
                let apiDescription = 'https://pokeapi.co/api/v2/pokemon/' + element + '/'
                let pokemonData = fetch(apiDescription)
                
                pokemonData.then(pokemon => pokemon.json())
                    .then(pokemonData => {
                        
                        let imgURL = pokemonData.sprites.other["official-artwork"].front_default
                        text +=
                        `
                        <div class="carousel-item">
                        <img src="${imgURL}" class="d-block w-100">
                        </div>
                        `
                        
                        
                        
                    })
            }); 
            
                        
            modalPoke.append(addModal)
            const modal = new bootstrap.Modal(modalPoke.querySelector('.modal'))
            modal.show()
            */






