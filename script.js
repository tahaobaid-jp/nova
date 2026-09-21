/*
  ============================================================
  NOVA PRODUCTEN
  ============================================================

  Pas hier eenvoudig producten, foto's, prijzen en teksten aan.

  Beschikbare categorieën:
  - T-shirts
  - Broeken
  - Hoodies
  - Jassen

  Voeg een nieuw product toe door een nieuw object aan deze array
  toe te voegen.
*/

const products = [
  {
    id: 1,
    name: "Essential T-shirt",
    category: "T-shirts",
    price: 29.95,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85",
    description:
      "Een zacht en comfortabel T-shirt van hoogwaardig biologisch katoen. De perfecte basic voor iedere dag.",
    badge: "Bestseller"
  },
  {
    id: 2,
    name: "Relaxed Linen Shirt",
    category: "T-shirts",
    price: 49.95,
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=85",
    description:
      "Een luchtig linnen shirt met een ontspannen pasvorm. Ideaal voor warme dagen en lange avonden.",
    badge: "Nieuw"
  },
  {
    id: 3,
    name: "Studio Wide Leg",
    category: "Broeken",
    price: 69.95,
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=85",
    description:
      "Een moderne broek met wijde pijpen en een comfortabele hoge taille. Gemaakt om vrij in te bewegen."
  },
  {
    id: 4,
    name: "Daily Denim",
    category: "Broeken",
    price: 79.95,
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=85",
    description:
      "Tijdloze denim met een rechte pasvorm. Een veelzijdige klassieker voor iedere garderobe."
  },
  {
    id: 5,
    name: "NOVA Logo Hoodie",
    category: "Hoodies",
    price: 64.95,
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85",
    description:
      "Een warme hoodie van zachte katoenmix met subtiel NOVA-logo. Comfortabel van ochtend tot avond.",
    badge: "Favoriet"
  },
  {
    id: 6,
    name: "Heavyweight Hoodie",
    category: "Hoodies",
    price: 74.95,
    image:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=85",
    description:
      "Een stevige oversized hoodie voor extra comfort. Afgewerkt met geribde boorden.",
    badge: "Nieuw"
  },
  {
    id: 7,
    name: "Everyday Trench",
    category: "Jassen",
    price: 119.95,
    image:
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=900&q=85",
    description:
      "Een elegante trenchcoat met een moderne snit. Beschermt tegen de wind en past bij iedere outfit."
  },
  {
    id: 8,
    name: "Puffer Jacket",
    category: "Jassen",
    price: 139.95,
    image:
      "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&w=900&q=85",
    description:
      "Een lichtgewicht jas met warme vulling en een minimalistisch silhouet. Klaar voor koude dagen."
  }
];

/*
  ============================================================
  STATUS
  ============================================================
*/

const state = {
  activeCategory: "Alle",
  searchTerm: "",
  sort: "default",
  cart: loadCart(),
  selectedProduct: null,
  selectedSize: "M"
};

/*
  ============================================================
  HTML-ELEMENTEN
  ============================================================
*/

const productGrid = document.querySelector("#productGrid");
const emptyProducts = document.querySelector("#emptyProducts");

const cartCount = document.querySelector(".cart-count");
const cartItems = document.querySelector("#cartItems");
const cartEmpty = document.querySelector("#cartEmpty");
const cartSummary = document.querySelector("#cartSummary");
const cartSubtotal = document.querySelector("#cartSubtotal");
const cartShipping = document.querySelector("#cartShipping");
const cartTotal = document.querySelector("#cartTotal");
const checkoutTotal = document.querySelector("#checkoutTotal");

const productModal = document.querySelector("#productModal");
const checkoutModal = document.querySelector("#checkoutModal");
const cartDrawer = document.querySelector("#cartDrawer");
const drawerOverlay = document.querySelector("#drawerOverlay");
const toast = document.querySelector("#toast");

const searchBar = document.querySelector(".search-bar");
const searchInput = document.querySelector("#searchInput");

const mainNav = document.querySelector("#mainNav");
const menuToggle = document.querySelector(".menu-toggle");

/*
  ============================================================
  ALGEMENE FUNCTIES
  ============================================================
*/

function formatPrice(price) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR"
  }).format(price);
}

function loadCart() {
  try {
    const savedCart = localStorage.getItem("novaCart");

    if (!savedCart) {
      return [];
    }

    const parsedCart = JSON.parse(savedCart);

    return Array.isArray(parsedCart) ? parsedCart : [];
  } catch (error) {
    console.warn("De opgeslagen winkelmand kon niet worden geladen.", error);
    return [];
  }
}

function saveCart() {
  localStorage.setItem("novaCart", JSON.stringify(state.cart));
}

function showToast(message) {
  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timeout);

  showToast.timeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

function lockBody() {
  document.body.classList.add("no-scroll");
}

function unlockBody() {
  const modalIsOpen =
    productModal?.classList.contains("open") ||
    checkoutModal?.classList.contains("open");

  const cartIsOpen = cartDrawer?.classList.contains("open");

  if (!modalIsOpen && !cartIsOpen) {
    document.body.classList.remove("no-scroll");
  }
}

/*
  ============================================================
  PRODUCTEN, ZOEKEN, FILTEREN EN SORTEREN
  ============================================================
*/

function getFilteredProducts() {
  let filteredProducts = [...products];

  if (state.activeCategory !== "Alle") {
    filteredProducts = filteredProducts.filter(
      product => product.category === state.activeCategory
    );
  }

  if (state.searchTerm.trim() !== "") {
    const searchTerm = state.searchTerm.toLowerCase().trim();

    filteredProducts = filteredProducts.filter(product => {
      const searchableText = [
        product.name,
        product.category,
        product.description
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(searchTerm);
    });
  }

  switch (state.sort) {
    case "price-low":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;

    case "price-high":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;

    case "name":
      filteredProducts.sort((a, b) =>
        a.name.localeCompare(b.name, "nl")
      );
      break;

    case "default":
    default:
      break;
  }

  return filteredProducts;
}

function renderProducts() {
  if (!productGrid) {
    return;
  }

  const filteredProducts = getFilteredProducts();

  productGrid.innerHTML = filteredProducts
    .map(product => {
      const badgeHTML = product.badge
        ? `<span class="product-badge">${product.badge}</span>`
        : "";

      return `
        <article class="product-card">
          <div class="product-image-wrap">
            ${badgeHTML}

            <img
              src="${product.image}"
              alt="${product.name}"
              loading="lazy"
            >

            <button
              class="quick-add"
              type="button"
              data-action="quick-add"
              data-id="${product.id}"
            >
              Snel toevoegen
            </button>
          </div>

          <button
            class="product-info"
            type="button"
            data-action="details"
            data-id="${product.id}"
            aria-label="Bekijk details van ${product.name}"
          >
            <span class="product-category">${product.category}</span>
            <h3 class="product-name">${product.name}</h3>
            <span class="product-price">${formatPrice(product.price)}</span>
          </button>
        </article>
      `;
    })
    .join("");

  emptyProducts?.classList.toggle(
    "hidden",
    filteredProducts.length > 0
  );
}

function updateFilterButtons() {
  document.querySelectorAll(".filter-button").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.filter === state.activeCategory
    );
  });
}

function setCategory(category, scrollToShop = true) {
  state.activeCategory = category;

  updateFilterButtons();
  renderProducts();

  if (scrollToShop) {
    document.querySelector("#shop")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}

/*
  ============================================================
  WINKELMAND
  ============================================================
*/

function getCartItemCount() {
  return state.cart.reduce((total, item) => {
    return total + item.quantity;
  }, 0);
}

function getCartSubtotal() {
  return state.cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
}

function getShippingCost(subtotal) {
  if (subtotal === 0 || subtotal >= 75) {
    return 0;
  }

  return 4.95;
}

function updateCartCount() {
  if (cartCount) {
    cartCount.textContent = getCartItemCount();
  }
}

function renderCart() {
  if (!cartItems) {
    return;
  }

  const subtotal = getCartSubtotal();
  const shipping = getShippingCost(subtotal);
  const total = subtotal + shipping;

  cartItems.innerHTML = state.cart
    .map(item => {
      return `
        <div class="cart-item">
          <img
            src="${item.image}"
            alt="${item.name}"
          >

          <div>
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-size">Maat: ${item.size}</div>
            <div class="cart-item-price">
              ${formatPrice(item.price)}
            </div>

            <div class="quantity-controls">
              <button
                type="button"
                aria-label="Aantal van ${item.name} verminderen"
                data-cart-action="decrease"
                data-cart-id="${item.cartId}"
              >
                −
              </button>

              <span>${item.quantity}</span>

              <button
                type="button"
                aria-label="Aantal van ${item.name} verhogen"
                data-cart-action="increase"
                data-cart-id="${item.cartId}"
              >
                +
              </button>
            </div>
          </div>

          <button
            class="remove-item"
            type="button"
            data-cart-action="remove"
            data-cart-id="${item.cartId}"
          >
            Verwijder
          </button>
        </div>
      `;
    })
    .join("");

  const isEmpty = state.cart.length === 0;

  cartEmpty?.classList.toggle("hidden", !isEmpty);
  cartSummary?.classList.toggle("hidden", isEmpty);

  if (cartSubtotal) {
    cartSubtotal.textContent = formatPrice(subtotal);
  }

  if (cartShipping) {
    cartShipping.textContent =
      shipping === 0 ? "Gratis" : formatPrice(shipping);
  }

  if (cartTotal) {
    cartTotal.textContent = formatPrice(total);
  }

  if (checkoutTotal) {
    checkoutTotal.textContent = formatPrice(total);
  }

  updateCartCount();
}

function addToCart(product, size = "M") {
  if (!product) {
    return;
  }

  const cartId = `${product.id}-${size}`;

  const existingItem = state.cart.find(
    item => item.cartId === cartId
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    state.cart.push({
      cartId,
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size,
      quantity: 1
    });
  }

  saveCart();
  renderCart();

  showToast(`${product.name} is toegevoegd aan je winkelmand.`);
}

function changeCartQuantity(cartId, amount) {
  const cartItem = state.cart.find(
    item => item.cartId === cartId
  );

  if (!cartItem) {
    return;
  }

  cartItem.quantity += amount;

  if (cartItem.quantity <= 0) {
    state.cart = state.cart.filter(
      item => item.cartId !== cartId
    );
  }

  saveCart();
  renderCart();
}

function removeFromCart(cartId) {
  const removedItem = state.cart.find(
    item => item.cartId === cartId
  );

  state.cart = state.cart.filter(
    item => item.cartId !== cartId
  );

  saveCart();
  renderCart();

  if (removedItem) {
    showToast(`${removedItem.name} is verwijderd.`);
  }
}

/*
  ============================================================
  PRODUCTDETAILS EN MATEN
  ============================================================
*/

function openProductModal(productId) {
  const product = products.find(
    item => item.id === Number(productId)
  );

  if (!product || !productModal) {
    return;
  }

  state.selectedProduct = product;
  state.selectedSize = "M";

  const image = document.querySelector("#modalProductImage");
  const category = document.querySelector("#modalProductCategory");
  const name = document.querySelector("#modalProductName");
  const price = document.querySelector("#modalProductPrice");
  const description = document.querySelector("#modalProductDescription");

  if (image) {
    image.src = product.image;
    image.alt = product.name;
  }

  if (category) {
    category.textContent = product.category;
  }

  if (name) {
    name.textContent = product.name;
  }

  if (price) {
    price.textContent = formatPrice(product.price);
  }

  if (description) {
    description.textContent = product.description;
  }

  document.querySelectorAll(".sizes button").forEach(button => {
    button.classList.toggle(
      "selected",
      button.dataset.size === state.selectedSize
    );
  });

  openModal(productModal);
}

function selectSize(size) {
  state.selectedSize = size;

  document.querySelectorAll(".sizes button").forEach(button => {
    button.classList.toggle(
      "selected",
      button.dataset.size === size
    );
  });
}

function openModal(modal) {
  if (!modal) {
    return;
  }

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  lockBody();
}

function closeModal(modal) {
  if (!modal) {
    return;
  }

  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  unlockBody();
}

/*
  ============================================================
  WINKELMAND OPENEN EN SLUITEN
  ============================================================
*/

function openCart() {
  if (!cartDrawer || !drawerOverlay) {
    return;
  }

  renderCart();

  cartDrawer.classList.add("open");
  drawerOverlay.classList.add("open");
  lockBody();
}

function closeCart() {
  if (!cartDrawer || !drawerOverlay) {
    return;
  }

  cartDrawer.classList.remove("open");
  drawerOverlay.classList.remove("open");
  unlockBody();
}

/*
  ============================================================
  PRODUCT-EVENTS
  ============================================================
*/

productGrid?.addEventListener("click", event => {
  const actionElement = event.target.closest("[data-action]");

  if (!actionElement) {
    return;
  }

  const productId = Number(actionElement.dataset.id);
  const product = products.find(item => item.id === productId);

  if (!product) {
    return;
  }

  if (actionElement.dataset.action === "quick-add") {
    addToCart(product, "M");
  }

  if (actionElement.dataset.action === "details") {
    openProductModal(productId);
  }
});

/*
  ============================================================
  CATEGORIEËN EN FILTERS
  ============================================================
*/

document.querySelectorAll("[data-category]").forEach(button => {
  button.addEventListener("click", () => {
    setCategory(button.dataset.category);
  });
});

document.querySelectorAll(".filter-button").forEach(button => {
  button.addEventListener("click", () => {
    setCategory(button.dataset.filter, false);
  });
});

/*
  ============================================================
  ZOEKEN
  ============================================================
*/

document.querySelector(".search-toggle")?.addEventListener("click", () => {
  searchBar?.classList.toggle("open");

  if (searchBar?.classList.contains("open")) {
    searchInput?.focus();
  }
});

document.querySelector(".close-search")?.addEventListener("click", () => {
  searchBar?.classList.remove("open");

  if (searchInput) {
    searchInput.value = "";
  }

  state.searchTerm = "";
  state.activeCategory = "Alle";

  updateFilterButtons();
  renderProducts();
});

searchInput?.addEventListener("input", event => {
  state.searchTerm = event.target.value;
  state.activeCategory = "Alle";

  updateFilterButtons();
  renderProducts();
});

/*
  ============================================================
  SORTEREN
  ============================================================
*/

document.querySelector("#sortSelect")?.addEventListener("change", event => {
  state.sort = event.target.value;
  renderProducts();
});

/*
  ============================================================
  PRODUCTMODAL
  ============================================================
*/

document.querySelectorAll("[data-close-modal]").forEach(button => {
  button.addEventListener("click", () => {
    closeModal(productModal);
  });
});

productModal?.addEventListener("click", event => {
  if (event.target === productModal) {
    closeModal(productModal);
  }
});

document.querySelectorAll(".sizes button").forEach(button => {
  button.addEventListener("click", () => {
    selectSize(button.dataset.size);
  });
});

document.querySelector("#modalAddButton")?.addEventListener("click", () => {
  if (!state.selectedProduct) {
    return;
  }

  addToCart(state.selectedProduct, state.selectedSize);
  closeModal(productModal);
  openCart();
});

/*
  ============================================================
  WINKELMAND-EVENTS
  ============================================================
*/

document.querySelector(".cart-toggle")?.addEventListener("click", () => {
  openCart();
});

document.querySelector("#closeCart")?.addEventListener("click", () => {
  closeCart();
});

drawerOverlay?.addEventListener("click", () => {
  closeCart();
});

cartItems?.addEventListener("click", event => {
  const actionButton = event.target.closest("[data-cart-action]");

  if (!actionButton) {
    return;
  }

  const cartId = actionButton.dataset.cartId;
  const action = actionButton.dataset.cartAction;

  if (action === "increase") {
    changeCartQuantity(cartId, 1);
  }

  if (action === "decrease") {
    changeCartQuantity(cartId, -1);
  }

  if (action === "remove") {
    removeFromCart(cartId);
  }
});

document.querySelector(".close-cart-link")?.addEventListener("click", () => {
  closeCart();
});

/*
  ============================================================
  CHECKOUT
  ============================================================
*/

document.querySelector("#checkoutButton")?.addEventListener("click", () => {
  if (state.cart.length === 0) {
    showToast("Je winkelmand is leeg.");
    return;
  }

  renderCart();
  closeCart();
  openModal(checkoutModal);
});

document.querySelectorAll("[data-close-checkout]").forEach(button => {
  button.addEventListener("click", () => {
    closeModal(checkoutModal);
  });
});

checkoutModal?.addEventListener("click", event => {
  if (event.target === checkoutModal) {
    closeModal(checkoutModal);
  }
});

document.querySelector("#checkoutForm")?.addEventListener("submit", event => {
  event.preventDefault();

  if (state.cart.length === 0) {
    closeModal(checkoutModal);
    showToast("Je winkelmand is leeg.");
    return;
  }

  state.cart = [];

  saveCart();
  renderCart();
  closeModal(checkoutModal);

  event.target.reset();

  showToast("Bedankt! Je bestelling is succesvol geplaatst.");
});

/*
  ============================================================
  NIEUWSBRIEF
  ============================================================
*/

document.querySelector("#newsletterForm")?.addEventListener("submit", event => {
  event.preventDefault();

  event.target.reset();

  showToast("Je bent aangemeld voor de nieuwsbrief.");
});

/*
  ============================================================
  MOBIELE NAVIGATIE
  ============================================================
*/

menuToggle?.addEventListener("click", () => {
  const isOpen = mainNav?.classList.toggle("open");

  menuToggle.setAttribute(
    "aria-expanded",
    String(Boolean(isOpen))
  );
});

mainNav?.addEventListener("click", event => {
  if (event.target.matches("a")) {
    mainNav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }
});

/*
  ============================================================
  ESCAPE-TOETS
  ============================================================
*/

document.addEventListener("keydown", event => {
  if (event.key !== "Escape") {
    return;
  }

  closeCart();
  closeModal(productModal);
  closeModal(checkoutModal);

  searchBar?.classList.remove("open");
  mainNav?.classList.remove("open");

  menuToggle?.setAttribute("aria-expanded", "false");
});

/*
  ============================================================
  START
  ============================================================
*/

renderProducts();
renderCart();
