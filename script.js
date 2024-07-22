const todoValue = document.getElementById("todoText");
const todoAlert = document.getElementById("Alert");
const listItems = document.getElementById("list-items");
const addUpdate = document.getElementById("AddUpdateClick");

let todo = JSON.parse(localStorage.getItem("todo-list")) || [];
let updateText = null;

function CreateToDoItems() {
  if (todoValue.value === "") {
    setAlertMessage("Please enter your todo text!");
    todoValue.focus();
  } else {
    if (todo.some((element) => element.item === todoValue.value)) {
      setAlertMessage("This item already present in the list!");
      return;
    }

    const li = document.createElement("li");
    const todoItems = `
            <div title="Hit Double Click and Complete" ondblclick="CompletedToDoItems(this)">${todoValue.value}</div>
            <div>
                <img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="images/pencil.png" />
                <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="images/delete.png" />
            </div>`;
    li.innerHTML = todoItems;
    listItems.appendChild(li);

    todo.push({ item: todoValue.value, status: false });
    setLocalStorage();
    todoValue.value = "";
    setAlertMessage("Todo item Created Successfully!");
  }
}

function ReadToDoItems() {
  listItems.innerHTML = ""; // Clear the list before reading items
  todo.forEach((element) => {
    const li = document.createElement("li");
    let style = element.status ? "style='text-decoration: line-through'" : "";
    const todoItems = `
            <div ${style} title="Hit Double Click and Complete" ondblclick="CompletedToDoItems(this)">${
      element.item
    }
                ${
                  element.status
                    ? '<img class="todo-controls" src="images/check-mark.png" />'
                    : ""
                }
            </div>
            <div>
                ${
                  !element.status
                    ? '<img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="images/pencil.png" />'
                    : ""
                }
                <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="images/delete.png" />
            </div>`;
    li.innerHTML = todoItems;
    listItems.appendChild(li);
  });
}

function UpdateToDoItems(e) {
  if (
    e.parentElement.parentElement.querySelector("div").style.textDecoration ===
    ""
  ) {
    todoValue.value = e.parentElement.parentElement
      .querySelector("div")
      .innerText.trim();
    updateText = e.parentElement.parentElement.querySelector("div");
    addUpdate.setAttribute("onclick", "UpdateOnSelectionItems()");
    addUpdate.setAttribute("src", "images/refresh.png");
    todoValue.focus();
  }
}

function UpdateOnSelectionItems() {
  if (todo.some((element) => element.item === todoValue.value)) {
    setAlertMessage("This item already present in the list!");
    return;
  }

  todo.forEach((element) => {
    if (element.item === updateText.innerText.trim()) {
      element.item = todoValue.value;
    }
  });
  setLocalStorage();

  updateText.innerText = todoValue.value;
  addUpdate.setAttribute("onclick", "CreateToDoItems()");
  addUpdate.setAttribute("src", "images/plus.png");
  todoValue.value = "";
  setAlertMessage("Todo item Updated Successfully!");
}

function DeleteToDoItems(e) {
  const deleteValue = e.parentElement.parentElement
    .querySelector("div")
    .innerText.trim();
  if (confirm(`Are you sure you want to delete this ${deleteValue}?`)) {
    e.parentElement.parentElement.classList.add("deleted-item");

    todo = todo.filter((element) => element.item !== deleteValue);
    setTimeout(() => {
      e.parentElement.parentElement.remove();
      setLocalStorage();
      setAlertMessage("Todo item Deleted Successfully!");
    }, 1000);
  }
}

function CompletedToDoItems(e) {
  const itemDiv = e.parentElement.querySelector("div");
  if (itemDiv.style.textDecoration === "") {
    itemDiv.style.textDecoration = "line-through";
    itemDiv.innerHTML +=
      '<img class="todo-controls" src="images/check-mark.png" />';
    e.parentElement.querySelector("img.edit").remove();

    todo.forEach((element) => {
      if (element.item === itemDiv.innerText.trim()) {
        element.status = true;
      }
    });
    setLocalStorage();
    setAlertMessage("Todo item Completed Successfully!");
  }
}

function setLocalStorage() {
  localStorage.setItem("todo-list", JSON.stringify(todo));
}

function setAlertMessage(message) {
  todoAlert.innerText = message;
  todoAlert.classList.remove("toggleMe");
  setTimeout(() => {
    todoAlert.classList.add("toggleMe");
  }, 2000);
}

document.addEventListener("DOMContentLoaded", ReadToDoItems);
