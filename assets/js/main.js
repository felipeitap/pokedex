const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");
const overlay = document.querySelector(".overlay");
const modal = document.querySelector(".modal");
const modalImage = document.querySelector(".modal-image");
const typeContainer = document.querySelector(".types-container");
const pokemonAbilities = document.querySelector(".abilities");

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
  createPokemonDetails(pokemon);
  createPokemonNumberAndName(pokemon);
  console.log(pokemon);
}

function createPokemonDetails(pokemon) {
  const pokemonHeight = document.querySelector(".height");
  const pokemonWeight = document.querySelector(".weight");
  const pokemonType = document.querySelector(".info-type");

  pokemonHeight.innerHTML = `${(pokemon.height * 2, 54)}cm`;
  pokemonWeight.innerHTML = `${pokemon.weight}kg`;
  pokemonType.innerHTML = pokemon.type;

  pokemon.abilities.forEach((ability, index) => {
    if (index + 1 !== pokemon.abilities.length) {
      pokemonAbilities.innerHTML += `${ability}, `;
    } else {
      pokemonAbilities.innerHTML += `${ability}`;
    }
  });
}

function createPokemonNumberAndName(pokemon) {
  const pokemonName = document.querySelector(".pokemon-name");
  const pokemonNumber = document.querySelector(".pokemon-number");

  pokemonName.innerHTML = pokemon.name;
  pokemonNumber.innerHTML = `#${pokemon.number}`;
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

function openModal() {
  const aboutTab = document.querySelector("#about");
  aboutTab.classList.add("selected");
  overlay.classList.remove("hidden");
  modal.classList.remove("hidden");
}

function addListeners() {
  const pokemonsEllements = Array.from(
    document.getElementsByClassName("pokemon")
  );

  pokemonsEllements.forEach((element) => {
    element.addEventListener("click", () => {
      retriveOnePokemon(element.dataset.number);
      openModal();
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

function closeModal() {
  overlay.classList.add("hidden");
  modal.classList.add("hidden");

  modalImage.children[0].remove();
  modal.classList.remove(modal.classList[1]);
  typeContainer.classList.remove("wide");

  typeContainer.innerHTML = "";
  pokemonAbilities.innerHTML = "";
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

overlay.addEventListener("click", closeModal);

loadPokemonItens(offset, limit);
