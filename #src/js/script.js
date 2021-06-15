/******* variables *******/
const input = document.getElementById("count_pokemon");
const buttons = document.querySelectorAll("button");
const sectionWrapper = document.querySelector(".content__wrapper");
const buttonSearchName = document.getElementById("searchPokemon");
const butttonSearchType = document.getElementById("searchTypePokemon");

/******* create objects *******/
function createObject(pokemon) {
  // Generate element


  document.getElementById("namePokemon").value = "";

  let mainDiv = document.createElement("div");
  let contentImg = document.createElement("div");
  let img = document.createElement("img");
  let idPok = document.createElement("div");
  let contentName = document.createElement("div");
  let contentType = document.createElement("div");
  let contentStats = document.createElement("div");

  mainDiv.classList.add("content-item");
  contentImg.classList.add("content__img");
  idPok.classList.add("content__id");
  contentName.classList.add("content__name");
  contentType.classList.add("content__type");
  contentStats.classList.add("content__stats");

  // Filling element
  img.src = pokemon.sprites.front_default;
  idPok.innerHTML = "ID: " + pokemon.id;
  contentName.innerHTML = "Name: " + pokemon.name;
  contentType.innerHTML = "Type: " + pokemon.types[0].type.name;
  contentStats.innerHTML = "Ability: " + pokemon.abilities[0].ability.name;

  mainDiv.appendChild(contentImg);
  contentImg.appendChild(img);
  mainDiv.appendChild(idPok);
  mainDiv.appendChild(contentName);
  mainDiv.appendChild(contentType);
  mainDiv.appendChild(contentStats);

  // add animate
  mainDiv.classList.add('animate__bounceIn');
  mainDiv.classList.add('animate__animated');
  mainDiv.classList.add('wow');
  
  // Add to section
  sectionWrapper.appendChild(mainDiv);
}

/******* show 10/20/50 *******/
buttons.forEach((element) => {
  element.addEventListener("click", function () {
      const getPocemon = async (id) => {
      let count = parseInt(element.value);

      // clear elements
      clearWrapper();

      for (let i = 1; i <= count; i++) {
        id = i;
        const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
        const res = await fetch(url);
        const pokemon = await res.json();
        createObject(pokemon);
      }
    };
    getPocemon(1);
  });
});

/******* clear wrapper *******/
function clearWrapper() {
  let element = document.getElementById("content__wrapper");
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/******* search by id or name *******/
buttonSearchName.addEventListener("click", function () {
  clearWrapper();

  let valueInput = document.getElementById("namePokemon");
  valueInput.value = valueInput.value.toLowerCase();

  if (valueInput.value == "") {
    let result = document.createElement("div");
    result.innerHTML = "Your line is empty!!!";
    result.classList.add("result-empty");

    sectionWrapper.appendChild(result);
  } else {
    const getPocemon = async (name) => {
      // clear elements
      clearWrapper();

      try {
        const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
        const res = await fetch(url);
        const pokemon = await res.json();
        createObject(pokemon);

      } catch (error) {
        let errorMes = document.createElement("div");
        errorMes.innerHTML = `There is not pokemon named ${name}`;
        errorMes.classList.add("result-empty");

        valueInput.value = "";

        sectionWrapper.appendChild(errorMes);
      }
    };
    getPocemon(valueInput.value);
  }
});

/******* search by type *******/
butttonSearchType.addEventListener("click", function () {
  clearWrapper();

  let checkboxes = document.getElementsByClassName("checkbox");
  let checkboxesCount = document.getElementsByClassName("checkbox__count");
  let checkBoxesValue = [];
  let radioBoxesValue;
  let radioBoxesValueArray = [];

  //value from radio
  for (let index = 0; index < checkboxesCount.length; index++) {
    if (checkboxesCount[index].checked) {
      radioBoxesValue = checkboxesCount[index].value;
    }
  }
  // value from checkbox
  let k = 0;
  for (let index = 0; index < checkboxes.length; index++) {
    if (checkboxes[index].checked) {
      checkBoxesValue.push(checkboxes[index].value);
      radioBoxesValueArray[k] = radioBoxesValue;
      k++;
    }
  }

  if (checkBoxesValue.length > 0) {
    const getPocemon = async () => {
      let count = 898; // all pokemons
      let repeatElements = 0; // end for
      clearWrapper(); // clear wrapper elements

      for (let i = 1; i <= count; i++) {
        const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        const res = await fetch(url);
        const pokemon = await res.json();

        for (let j = 0; j < checkBoxesValue.length; j++) {
          if (pokemon.types[0].type.name == checkBoxesValue[j] && radioBoxesValueArray[j] != 0) {
            createObject(pokemon);
            if (--radioBoxesValueArray[j] === 0) {
              repeatElements++;
            }
          }
        }
        if (repeatElements === checkBoxesValue.length) {
          break;
        }
      }
    };
    getPocemon();
  } else {
    let errorMes = document.createElement("div");
    errorMes.innerHTML = `Select any type or types`;
    errorMes.classList.add("result-empty");

    sectionWrapper.appendChild(errorMes);
  }
});
  
// animation
new WOW().init();