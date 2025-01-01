let API_URL = "http://localhost:3000/shopping-list";
API_URL = "https://shopping-backend-ko5z.onrender.com/shopping-list";

// Функція для отримання списку покупок з сервера
async function fetchShoppingList() {
  try {
    const response = await fetch(API_URL);
    const items = await response.json();
    displayShoppingList(items);
  } catch (error) {
    console.error("Error loading shopping list:", error);
  }
}

// Функція для зміни статусу "куплено/не куплено"
async function toggleBoughtStatus(itemId, bought) {
  try {
    const response = await fetch(`${API_URL}/${itemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bought }),
    });

    if (!response.ok) {
      throw new Error("Error updating status");
    }

    await fetchShoppingList();
  } catch (error) {
    console.error("Error when changing status:", error);
  }
}

// Функція для видалення елемента зі списку
async function deleteItem(itemId) {
  try {
    const response = await fetch(`${API_URL}/${itemId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Error during deletion");
    }

    await fetchShoppingList();
  } catch (error) {
    console.error("Error deleting item:", error);
  }
}

function displayShoppingList(items) {
  const shoppingList = document.querySelector(".shopping-list");

  let list_items = "";

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    list_items += `<li id="${item.id}" class="shopping-list-item">
        <input
          class="visually-hidden checkbox"
          type="checkbox"
          name="item${i}"
          id="item${i}"
          ${item.bought ? "checked" : ""}
          onChange = "toggleBoughtStatus(${item.id}, this.checked)"
        />
        <label class="shopping-list-item-label" for="item${i}">
          <svg class="shopping-list-item-icon">
            <use href="./sprite.svg#icon-star-full" />
          </svg>
          <span class="shopping-list-item-text">${item.name}</span>
        </label>
        <button class="shopping-list-remove" onClick="deleteItem(${item.id})">
          <svg class="shopping-list-remove-icon">
            <use href="./sprite.svg#icon-cross" />
          </svg>
        </button>
      </li>`;
  }

  shoppingList.innerHTML = list_items;
}

// Завантажуємо список покупок при завантаженні сторінки
fetchShoppingList();

// Функція для додавання нового елемента до списку
function addItem() {
  const newItemInput = document.querySelector(".js-add-input");
  const addButton = document.querySelector(".js-add-button");
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
      addButton.disabled = true;
      if (!response.ok) {
        throw new Error("Помилка при додаванні нового елемента");
      }
      return response.json();
    })
    .then(() => {
      fetchShoppingList();
      newItemInput.value = "";
    })
    .catch((error) => console.error("Помилка при додаванні елемента:", error))
    .finally(() => {
      addButton.disabled = false;
    });
}
