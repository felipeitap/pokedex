const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");
const overlay = document.querySelector(".overlay");
const modal = document.querySelector(".modal");
const modalImage = document.querySelector(".modal-image");
const typeContainer = document.querySelector(".types-container");

const maxRecords = 151;
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
  return `
        <li class="pokemon ${pokemon.type}" data-number=${pokemon.number}>
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types
                      .map((type) => `<li class="type ${type}">${type}</li>`)
                      .join("")}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `;
}

async function retriveOnePokemon(pokemonNumber) {
  const pokemon = await pokeApi.getByNumber(pokemonNumber);

  modal.classList.add(pokemon.type);
  
  createPokemonImage(pokemon);
  createPokemonTypes(pokemon);
  setPokemonName(pokemon);
  console.log(pokemon);
}

function setPokemonName(pokemon) {
  const pokemonName = document.querySelector(".pokemon-name");

  pokemonName.innerHTML = pokemon.name;
}

function createPokemonImage(pokemon) {
  const image = document.createElement("img");
  image.src = pokemon.photo;
  modalImage.appendChild(image);
}

function createPokemonTypes(pokemon) {
  if (pokemon.types.length > 1) {
    typeContainer.classList.add("wide");
  }

  pokemon.types.forEach((type) => {
    const div = document.createElement("div");
    div.classList.add("pokemon-type");
    div.innerHTML = type;

    typeContainer.appendChild(div);
  });
}

function addListeners() {
  const pokemonsEllements = Array.from(
    document.getElementsByClassName("pokemon")
  );

  pokemonsEllements.forEach((element) => {
    element.addEventListener("click", () => {
      retriveOnePokemon(element.dataset.number);
      overlay.classList.remove("hidden");
    });
  });
}

function loadPokemonItens(offset, limit) {
  pokeApi
    .getPokemons(offset, limit)
    .then((pokemons = []) => {
      const newHtml = pokemons.map(convertPokemonToLi).join("");
      pokemonList.innerHTML += newHtml;
    })
    .then(() => {
      addListeners();
    });
}

loadMoreButton.addEventListener("click", () => {
  offset += limit;
  const qtdRecordsWithNexPage = offset + limit;

  if (qtdRecordsWithNexPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit);

    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItens(offset, limit);
  }
});

overlay.addEventListener("click", () => {
  overlay.classList.add("hidden");

  modalImage.children[0].remove();
  modal.classList.remove(modal.classList[1]);
  typeContainer.classList.remove("wide");

  typeContainer.innerHTML = "";
});

loadPokemonItens(offset, limit);
