//(1)
//We use the "DOMContentLoaded" event and don't wait for the page to fully load,
//but only the DOM structure

document.addEventListener("DOMContentLoaded", () => {
  const personDB = {
    personNames: [
      // "Mykhailo Biletskyi",
      // "Yaroslav Dzyuminskyi",
      // "Evgeny Morsky",
      // "Ruslana Musienko",
      // "Anna Yarosevich",
    ],
  };
  //(2)
  //We get the necessary elements for work

  const personList = document.querySelector(".promo__interactive-list"),
    addForm = document.querySelector("form.add"),
    addInput = addForm.querySelector(".adding__input");

  //(3)
  //Add an event handler

  addForm.addEventListener("submit", (event) => {
    event.preventDefault();

    let newPerson = addInput.value;

    //(4)
    //If the newPerson variable is not empty, we add it to our "database"
    //And sort alphabetically
    if (newPerson) {
      personDB.personNames.push(newPerson);
      sortArr(personDB.personNames);

      createPersonList(personDB.personNames, personList);

      //(5)
      //Check the length of the entered name in the form

      if (newPerson.length > 21) {
        newPerson = `${newPerson.substring(0, 22)}...`;
      }
    }

    event.target.reset();

    //(6)
    //We will give the elements the previously mentioned draggable attribute
    //with a value of true to allow tasks to move.

    const tasksListElement = document.querySelector(`.promo__interactive-list`);
    const taskElements = tasksListElement.querySelectorAll(
      `.promo__interactive-item`
    );

    //(7)
    //Loop through all the elements of the list and assign the desired value

    for (const task of taskElements) {
      task.draggable = true;
    }

    //(8)
    //Next will monitoring the dragstart and dragend events on the entire list.
    // At the beginning of the drag, we will add the selected class to the list element on which the event was fired.
    // After the end of dragging, we will delete this class.

    tasksListElement.addEventListener(`dragstart`, (evt) => {
      evt.target.classList.add(`selected`);
    });

    tasksListElement.addEventListener(`dragend`, (evt) => {
      evt.target.classList.remove(`selected`);
    });

    //(9)
    //Next, we track the coordinates
    //The function should take as input the vertical coordinate of the cursor and the current element on which the dragover event fired.
    // We will compare the current position of the cursor with the central axis of the element over which the cursor is at the moment of dragging.

    //Get an object with dimensions and coordinates

    const getNextElement = (cursorPosition, currentElement) => {
      const currentElementCoord = currentElement.getBoundingClientRect();
      // Find the vertical coordinate of the current element's center
      const currentElementCenter =
        currentElementCoord.y + currentElementCoord.height / 2;

      //(10)
      // If the cursor is above the center of the element, return the current element
      // Otherwise, the next DOM element

      const nextElement =
        cursorPosition < currentElementCenter
          ? currentElement
          : currentElement.nextElementSibling;

      return nextElement;
    };

    // Allow dropping elements into this area

    tasksListElement.addEventListener(`dragover`, (evt) => {
      evt.preventDefault();

      //(11)
      // Find the element to be moved

      const activeElement = tasksListElement.querySelector(`.selected`);

      //(12)
      // Find the element the cursor is currently over

      const currentElement = evt.target;

      //(13)
      // Check if the event fired:
      // 1. not on the element we are moving,
      // 2. exactly on the list element

      const isMoveable =
        activeElement !== currentElement &&
        currentElement.classList.contains(`promo__interactive-item`);

      // If not, abort the function

      if (!isMoveable) {
        return;
      }

      const nextElement = getNextElement(evt.clientY, currentElement);

      //(14)
      // Check if elements need to be swapped

      if (
        (nextElement && activeElement === nextElement.previousElementSibling) ||
        activeElement === nextElement
      ) {
        // If not, we exit the function to avoid unnecessary changes to the DOM
        return;
      }

      tasksListElement.insertBefore(activeElement, nextElement);
    });
  });

  const sortArr = (arr) => {
    arr.sort();
  };

  //(15)
  //This function creates a new element in the DOM structure,
  //sorts and deletes a certain element

  function createPersonList(pers, parent) {
    parent.innerHTML = "";
    sortArr(pers);

    pers.forEach((per, i) => {
      parent.innerHTML += `
                  <li class="promo__interactive-item">${i + 1} ${per}
                      <div class="delete"></div>
                  </li>
              `;
    });

    document.querySelectorAll(".delete").forEach((btn, i) => {
      btn.addEventListener("click", () => {
        btn.parentElement.remove();
        personDB.personNames.splice(i, 1);

        createPersonList(pers, parent);
      });
    });
  }

  sortArr(personDB.personNames);
  createPersonList(personDB.personNames, personList);
});
