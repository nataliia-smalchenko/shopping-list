const API_URL = "https://6628960354afcabd07363870.mockapi.io/products";

// Функція для отримання списку покупок з сервера
function fetchShoppingList() {
  fetch(API_URL)
    .then((response) => response.json())
    .then((items) => displayShoppingList(items))
    .catch((error) =>
      console.error("Помилка при завантаженні списку покупок:", error)
    );
}

// Функція для відображення списку покупок на сторінці
function displayShoppingList(items) {
  const shoppingList = document.getElementById("shopping-list");

  // Створюємо HTML-розмітку для кожного елемента списку
  shoppingList.innerHTML = items
    .map(
      (item) => `
        <li>
            <input type="checkbox" ${
              item.bought ? "checked" : ""
            } onchange="toggleBoughtStatus(${item.id}, this.checked)">
            <span class="${item.bought ? "bought" : "not-bought"}">${
        item.name
      }</span>
            <button onclick="deleteItem(${item.id})">Видалити</button>
        </li>
    `
    )
    .join("");
}

// // Функція для відображення списку покупок на сторінці
// function displayShoppingList(items) {
//   const shoppingList = document.getElementById("shopping-list");
//   shoppingList.innerHTML = "";

//   items.forEach((item) => {
//     const listItem = document.createElement("li");

//     // Створюємо прапорець
//     const checkbox = document.createElement("input");
//     checkbox.type = "checkbox";
//     checkbox.checked = item.bought;
//     checkbox.onchange = () => toggleBoughtStatus(item.id, checkbox.checked);

//     // Створюємо текстовий елемент
//     const text = document.createElement("span");
//     text.textContent = item.name;
//     text.className = item.bought ? "bought" : "not-bought";

//     // Створюємо кнопку видалення
//     const deleteButton = document.createElement("button");
//     deleteButton.textContent = "Видалити";
//     deleteButton.onclick = () => deleteItem(item.id);

//     // Додаємо елементи до списку
//     listItem.appendChild(checkbox);
//     listItem.appendChild(text);
//     listItem.appendChild(deleteButton);
//     shoppingList.appendChild(listItem);
//   });
// }

// Функція для зміни статусу "куплено/не куплено"
function toggleBoughtStatus(itemId, bought) {
  fetch(`${API_URL}/${itemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ bought }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Помилка при оновленні статусу");
      }
      return response.json();
    })
    .then(() => fetchShoppingList())
    .catch((error) => console.error("Помилка при зміні статусу:", error));
}

// Функція для видалення елемента зі списку
function deleteItem(itemId) {
  fetch(`${API_URL}/${itemId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Помилка при видаленні");
      }
      return response.json();
    })
    .then(() => fetchShoppingList())
    .catch((error) => console.error("Помилка при видаленні елемента:", error));
}

// Функція для додавання нового елемента до списку
function addItem() {
  const newItemInput = document.getElementById("new-item");
  const newItemName = newItemInput.value.trim();

  if (newItemName === "") {
    alert("Введіть назву елемента");
    return;
  }

  fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: newItemName, bought: false }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Помилка при додаванні нового елемента");
      }
      return response.json();
    })
    .then(() => {
      fetchShoppingList();
      newItemInput.value = "";
    })
    .catch((error) => console.error("Помилка при додаванні елемента:", error));
}

// Завантажуємо список покупок при завантаженні сторінки
window.onload = fetchShoppingList;
