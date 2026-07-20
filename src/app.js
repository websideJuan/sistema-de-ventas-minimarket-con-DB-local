import { Modal } from "./components/modal/modal.js";

const fetchDatabase = async function () {
  try {
    const res = await fetch("./inventario.json");
    return await res.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const renderCartItem = () => {
  const listCartProducts = document.querySelector("#listCartProducts");
  listCartProducts.innerHTML = "";

  cart.map((item) => {
    const li = document.createElement("li");

    if (cart.length < 0) {
      li.innerHTML =
        "<div>Agrega los productos de tus clientes al carrito.</div>";
    } else {
      li.innerHTML = `
          <div class="flex gap-4 items-center bg-white shadow-xs rounded-xl">
            <img src="${item.img}" alt="${item.name}" class="w-20 h-20 object-cover"/>
            <div>
              <p class="text-gray-800 text-lg">${item.name}</p>
              <p class="text-gray-600/80 text-xs">${item.count} X ${item.unit.toUpperCase()}</p>
              <p class="font-mono text-xl">$${item.price.toLocaleString()}</p>
            </div>
          </div>
        `;
    }

    listCartProducts.appendChild(li);

    const totalPriceCart = cart.reduce(
      (acc, current) => acc + current.price,
      0,
    );

    document.querySelector("#cartFooter").innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <p><b>Cantidad</b></p> <span>${cart.length}</span>
        </div>
        <div>
          <p><b>Precio Neto:</b></p> ${Math.round(totalPriceCart).toLocaleString()}
        </div>
        <div>
          <p><b>+IVA:</b></p> ${Math.round(totalPriceCart * 0.19).toLocaleString()}
        </div>
        <div>
          <p><b>Total:</b></p> ${Math.round(totalPriceCart * 1.19).toLocaleString()}
        </div>
        <div>
          <button data-modal="addToMethodOfPay" class="bg-indigo-600 text-white py-2 px-4 cursor-pointer rounded shadow hover:bg-indigo-800">
            Agregar medio de pago
          </button>
      </div>
    `;
  });
};

document.querySelector("#cartFooter").addEventListener("click", (e) => {
  if (e.target.dataset.modal === "addToMethodOfPay") {
    const totalPrice = cart.reduce((acc, current) => acc + current.price, 0);

    const modal = Modal({
      context: `
        <p class="mb-6">Total a pagar: $${totalPrice}</p>
        <div class="flex gap-4" data-id="selectMethod">
          <div class="basis-1/2 relative">
            <input type="radio" class=" opacity-0 peer absolute inset-0" name="methodPay" data-id="cash">
            <label  class="peer-checked:outline-indigo-900 peer-checked:outline-2 block rounded-xl">
              <div class="py-6 w-60 ps-4 text-lg bg-green-600/10 text-green-600 border boredr-green-900 rounded-xl">
                <i class="fa-solid fa-money-bill-1"></i>
                <p>Efectivo</p>
              </div>
            </label>
          </div>
          <div class="basis-1/2 relative">
            <input type="radio" class=" opacity-0 peer absolute inset-0" name="methodPay" data-id="byCard">
            <label  class="peer-checked:outline-indigo-900 peer-checked:outline-2 block rounded-xl">
              <div class="py-6 w-60 ps-4 text-lg bg-blue-600/10 text-blue-600 border boredr-blue-900 rounded-xl">
                <i class="fa-solid fa-credit-card"></i>
                <p>Transbank</p>
              </div>
            </label>
          </div>
        </div>
      
      `,
      title: "Pago del cliente.",
      actions: () => {
        document
          .querySelectorAll('input[name="methodPay"]')
          .forEach((radio) => {
            let answer;
            if (radio.checked === true) {
              if (radio.dataset.id === "cash") {
                answer = prompt("Ingresa el monto pagado.");
              } else {
                answer = prompt("Opere su tarjeta.");
              }

              localStorage.setItem("cart", JSON.stringify([]));
              cart = []
              renderCartItem();

              const confirm = Modal({
                context: "Gracias por su compra!",
                title: "Compra realizada con exito!",
              });

              document.body.appendChild(confirm);
              setTimeout(() => {
                modal.remove();
                confirm.remove();
              }, 1000);
            }
          });
      },
    });

    document.body.appendChild(modal);
  }
});

document.querySelector("#addToProduct").addEventListener("click", () => {
  const modal = Modal({
    context: `
      <form id="createProductsForm" class="w-96">
        <div class="mb-3">
          <label for="name" class="font-thin mb-3 block">
            Nombre
          </label>
          <input
            class="w-full border border-gray-200 px-3 py-2 rounded-lg"
            type="text"
            name="name"
            placeholder="Ej: Bebida"
          />
        </div>
        <div class="mb-3">
          <label for="sku" class="font-thin mb-3 block">
            SKU
          </label>
          <input
            class="w-full border border-gray-200 px-3 py-2 rounded-lg"
            type="text"
            name="sku"
            placeholder="Ej: LC000-000"
          />
        </div>
        <div class="mb-3">
          <label for="stock" class="font-thin mb-3 block">
            Stock
          </label>
          <input
            class="w-full border border-gray-200 px-3 py-2 rounded-lg"
            type="text"
            name="stock"
            placeholder="Ej: Lacteos, Fiambre..."
          />
        </div>
         <div class="mb-3">
          <label for="category" class="font-thin mb-3 block">
            Categoria
          </label>
          <input
            class="w-full border border-gray-200 px-3 py-2 rounded-lg"
            type="text"
            name="category"
            placeholder="Ej: Lacteos, Fiambre..."
          />
        </div>

      </form>
    `,
    title: "Crear Articulo",
    actions: () => {
      const newProducts = {};
      document
        .querySelector("form#createProductsForm")
        .querySelectorAll("input")
        .forEach((input) => {
          if (input.value === "")
            return alert(`El(los) ${input.name} inputs no vacios!`);
          newProducts[input.name] = input.value;
        });
    },
  });
  document.body.appendChild(modal);
});

document.addEventListener("DOMContentLoaded", () => {
  renderCartItem();
});

document
  .querySelector("input[name='searchProduct']")
  .addEventListener("input", async (e) => {
    const { products } = await fetchDatabase();

    const filterProducts = products.filter((product) =>
      product.name.toLowerCase().includes(e.target.value.toLowerCase().trim()),
    );

    const ullistItem = document.querySelector("#renderProductsList");
    ullistItem.innerHTML = "";

    filterProducts.forEach((product) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div data-id="cardProduct" class="max-w-[230px] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md">
          <div class="relative h-48 bg-gray-100">
            <img src="public/image-card-background.jpg" alt="Product" class="h-full w-full object-cover" />
          </div>
          <div class="p-6">
            <h3 class="text-lg text-gray-400">${product.name}</h3>
          </div>
          <div class="border-t border-gray-100 bg-gray-50 px-6 py-4 flex items-center justify-between">
            <span class="text-lg font-extrabold text-gray-900">
              ${
                product.offer.active
                  ? product.offer.newPrice
                  : product.price.current
              }
            </span>
            <span id="unit">
              ${product.price.unit}
            </span>
            <button class="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-800 transition-colors">
              Buy Now
            </button>
          </div>
        </div>
      `;
      ullistItem.appendChild(li);
    });

    document
      .querySelectorAll("button.cursor-pointer.rounded-lg")
      .forEach((button) => {
        button.addEventListener("click", (e) => {
          const target = e.target.closest("div[data-id='cardProduct']");

          let product = {};
          product.name = target.querySelector(
            "h3.text-lg.text-gray-400",
          ).textContent;
          product.img = target
            .querySelector("img.h-full.w-full")
            .getAttribute("src");
          product.price = target.querySelector(
            "span.text-lg.font-extrabold.text-gray-900",
          ).textContent;
          product.unit = target.querySelector("span#unit").textContent.trim();

          let currentCount;

          if (product.unit.toLowerCase() === "kg") {
            currentCount = parseFloat(prompt("¿Cuantos kilogramos?"));
          } else if (product.unit.toLowerCase() === "unidad") {
            currentCount = Number(prompt("¿Cuantas cantidades?"));
          }

          const elementForCart = {};

          elementForCart.name = product.name;
          elementForCart.img = product.img;
          elementForCart.count = currentCount;
          elementForCart.price = Number(product.price) * currentCount;
          elementForCart.unit = product.unit;

          cart.push(elementForCart);
          localStorage.setItem("cart", JSON.stringify(cart));
          renderCartItem();
        });
      });
  });
