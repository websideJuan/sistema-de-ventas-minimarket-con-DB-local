import { Modal } from "./components/modal/modal.js";
import { userLogin, session  } from "./scripts/auth.js";

const fetchDatabase = async function () {
  try {
    const res = await fetch("./inventario.json");
    return await res.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

const isLoggin = session;

if (!isLoggin) {
  window.location.href = "test.html";
}

const userActive = userLogin()

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const renderCartItem = () => {
  const listCartProducts = document.querySelector("#listCartProducts");
  listCartProducts.innerHTML = "";

  cart.map((item) => {
    const li = document.createElement("li");
    li.setAttribute("data-id", "cartItem");
    li.setAttribute("data-idProduct", item.id);
    li.classList.add("relative");

    li.innerHTML = `
      <div class="flex gap-4 items-center bg-white shadow-xs rounded-xl">
        <img src="public/image-card-background.jpg" alt="${item.name}" class="w-20 h-20 object-cover"/>
        <div>
          <p class="text-gray-800 text-lg">${item.name}</p>
          <p class="text-gray-600/80 text-xs">${item.count} X ${item.price.unit.toUpperCase()}</p>
          ${
            item.offer.active
              ? `
          <div class="flex items-center gap-3">
            <p class="line-through text-gray-400">
              $ ${item.offer.oldPrice.toLocaleString()}
            </p>
            /
            <p class="font-mono text-xl text-gray-900">
              $ ${item.offer.newPrice.toLocaleString()}
            </p>
          </div>`
              : `<p class="font-mono text-xl">$${item.price.current.toLocaleString()}</p>`
          }
        </div>
      </div>
    `;

    listCartProducts.appendChild(li);

    updateCartFooter();
  });
};

const updateCartFooter = () => {
  const totalPriceCart = cart.reduce(
    (acc, current) => acc + current.price.current * current.count,
    0,
  );

  document.querySelector("#cartFooter").innerHTML = `
      <div class="flex flex-col gap-4">
        
        <div class="flex justify-between items-center">
          <p><b>Precio Neto:</b></p> ${Math.round(totalPriceCart).toLocaleString()}
        </div>
  
        <div class="flex justify-between items-center">
          <p><b>+IVA:</b></p> ${Math.round(totalPriceCart * 0.19).toLocaleString()}
        </div>
  
        <div class="flex justify-between items-center">
          <p><b>Total:</b></p> ${Math.round(totalPriceCart * 1.19).toLocaleString()}
        </div>
  
        <div>
          <button data-modal="addToMethodOfPay" class="w-full bg-indigo-600 text-white py-2 px-4 cursor-pointer rounded shadow hover:bg-indigo-800">
            Agregar medio de pago
          </button>
        </div>
      </div>
    `;
};

const startTheSalesDay = () => {
  const dataDailySale = JSON.parse(localStorage.getItem("dataDailySale"));

  if (!dataDailySale || dataDailySale.cashOnHand === 0) {
    const notDataDaily = Modal({
      context: `No has iniciado las ventas!`,
      title: "Accion requerida",
    });

    document.body.appendChild(notDataDaily);
    return;
  }
};

document.querySelector("#btnMenuOptions").addEventListener("click", (e) => {
  document.querySelector("#toggleMenuSetting").classList.toggle("hidden");
});

document.querySelector("#initDailySale").addEventListener("click", (e) => {
  const dataDailySale = JSON.parse(localStorage.getItem("dataDailySale"));

  if (dataDailySale && Number(dataDailySale.cashOnHand) > 0) {
    const modal = Modal({
      context: `Ya iniciaste el dia de ventas.`,
      title: "Ventas",
    });

    document.body.appendChild(modal);
    return;
  }

  const modal = Modal({
    context: "Para iniciar el dia ingrese el efectivo en caja.",
    title: "Inicia el dia de ventas.",
    actions: () => {
      const createDataDailySale = Modal({
        context: `
                 <div>
                   <div class="mb-6">
                     <label for="cashOnHand" class="mb-3 text-gray-600 block">
                       Efectivo en caja
                     </label>
                     <input class="w-full py-4 ps-4 border border-gray-400 rounded-xl" type="text" name="cashOnHand" data-id="cashOnHand" placeholder="10.000, 15.000, 20.000" required data-modify="seller"/>
                   </div>
                   <div class="mb-6">
                     <label for="sellerName" class="mb-3 text-gray-600 block">
                       Nombre del vendedor
                     </label>
                     <input class="w-full py-4 ps-4 border border-gray-400 rounded-xl bg-gray-300/80 pointer-events-none" type="text" name="sellerName" data-id="sellerName" placeholder="Nombre del vendedor" value=${userActive.username} required />
                   </div>
                 </div>
               `,
        title: "Inicia el dia de ventas.",
        actions: () => {
          const cashOnHand = document.querySelector(
            'input[data-id="cashOnHand"]',
          );

          const sellerName = document.querySelector(
            'input[data-id="sellerName"]',
          );

          const dataDailySale =
            JSON.parse(localStorage.getItem("dataDailySale")) || {};

          dataDailySale.cashOnHand = cashOnHand.value;
          dataDailySale.seller = sellerName.value;
          dataDailySale.salesOfDay = [];

          localStorage.setItem("dataDailySale", JSON.stringify(dataDailySale));

          const successCreateDataDailySale = Modal({
            context: "Has iniciado el dia de forma correcta!",
            title: "Inicia dia de ventas.",
          });

          document
            .querySelector('div[data-id="badgeNotification"]')
            .classList.add("hidden");

          document.body.appendChild(successCreateDataDailySale);

          setTimeout(() => {
            createDataDailySale.remove();
            successCreateDataDailySale.remove();
          }, 5000);
        },
      });

      document.body.appendChild(createDataDailySale);
      modal.remove();
    },
  });

  document.body.appendChild(modal);
});

document.querySelector("#cartFooter").addEventListener("click", (e) => {
  if (e.target.dataset.modal === "addToMethodOfPay") {
    const totalPrice =
      cart.reduce(
        (acc, current) => acc + current.price.current * current.count,
        0,
      ) * 1.19;

    const modal = Modal({
      context: `
        <p class="mb-6">Total a pagar: $${Math.round(totalPrice).toLocaleString()}</p>
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
            let dailySalesReport = {};

            if (radio.checked === true) {
              const confirmSale = {
                context: "",
                title: "Finalizar compra",
              };

              if (radio.dataset.id === "cash") {
                confirmSale.context = `
                  <div>
                    <p>Monto pagado</p>
                    <div class="flex gap-4 items-center" data-id="amountPaid">
                      ${
                        totalPrice > 10000
                          ? ["15000", "20000"]
                              .map(
                                (cash) =>
                                  `<button class="border border-gray-300 text-xl px-6 py-4">${cash}</button>`,
                              )
                              .join("")
                          : ["5000", "10000"]
                              .map(
                                (cash) =>
                                  `<button class="border border-gray-300 text-xl px-6 py-4">${cash}</button>`,
                              )
                              .join("")
                      }
                      <button class="border border-gray-300 text-xl px-6 py-4">
                        Otro
                      </button>
                    </div>
                  </div>
                `;
                dailySalesReport.amountPaid = answer;
              } else {
                confirmSale.context = `<div>
                    <p>Monto pagado</p>
                    <div class="flex gap-4 items-center" data-id="amountPaid">
                      <button class="border border-gray-300 text-xl px-6 py-4">
                        Credito.
                      </button>
                      <button class="border border-gray-300 text-xl px-6 py-4">
                        Debito.
                      </button>
                    </div>
                  </div>`;
                dailySalesReport.codeOperation = crypto.randomUUID();
              }

              const modalConfirmSale = Modal({
                context: confirmSale.context,
                title: confirmSale.title,
              });

              document.body.appendChild(modalConfirmSale);

              const amountPaid = document?.querySelector(
                'div[data-id="amountPaid"]',
              );

              dailySalesReport.methodPay = radio.dataset.id;
              dailySalesReport.totalPrice = totalPrice;
              dailySalesReport.countOfProduct = cart.length;

              amountPaid.addEventListener("click", (e) => {
                if (e.target.tagName === "BUTTON") {
                  let change = Number(e.target.textContent) - totalPrice;

                  if (e.target.textContent.trim() === "Otro") {
                    dailySalesReport.otherPay = prompt("Monto pagado: ");
                    change = Number(dailySalesReport.otherPay) - totalPrice;
                  }

                  dailySalesReport.amountPaid = e.target.textContent.trim();
                  dailySalesReport.change = change;

                  dailySalesReport.cartItems = cart.map((cartItem) => ({
                    cartItemName: cartItem.name,
                    cartItemCount: cartItem.count,
                    cartItemPrice: cartItem.price,
                  }));

                  const changeOfClient = Modal({
                    context: `${dailySalesReport.methodPay !== "byCard" ? `El vuelto que se tiene que dar al cliente es: $ ${change.toLocaleString()}` : "Continuar en transbanck..."}`,
                    title: "Finalizar compra.",
                  });

                  const dataDailySale = JSON.parse(
                    localStorage.getItem("dataDailySale"),
                  );

                  dataDailySale.cashOnHand =
                    Number(dataDailySale.cashOnHand) - change;

                  dataDailySale.salesOfDay.push(dailySalesReport);

                  localStorage.setItem(
                    "dataDailySale",
                    JSON.stringify(dataDailySale),
                  );

                  cart = [];
                  localStorage.setItem("cart", JSON.stringify(cart));
                  renderCartItem();
                  updateCartFooter();

                  setTimeout(() => {
                    modalConfirmSale.remove();
                    modal.remove();
                    changeOfClient.remove();
                  }, 5000);

                  document.body.appendChild(changeOfClient);
                }
              });
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

document.querySelector("#invoices").addEventListener("click", () => {
  const modal = Modal({
    context: `
      <h6 class="block mb-3">
        Ingresa el numero de la factura
      </h6>
      <p class="text-gray-400">
        Para crear una Factura necesitas ingresar el numero, monto, cantidad de articulos.
      </p>
      <div>
        <label for="invoiceId" class="block mb-3">
          N° de factura.
        </label>
        <input 
          type="text" 
          class="w-full border border-gray-400 py-3 ps-3 rounded-xl"
          name="invoiceId"
          data-id="invoiceId" 
          placeholder="1893729"  
        /> 
      </div>
    `,
    title: "Facturas",
    actions: () => {
      const invoiceId = document.querySelector('input[data-id="invoiceId"]');

      if (invoiceId.value === "" && invoiceId.value.length === 0) {
        const inputError = Modal({
          context: `El campo numero de factura no puede estar vacio!`,
          title: "Error!",
        });
        document.body.appendChild(inputError);
        return;
      }

      const invoices = JSON.parse(localStorage.getItem("invoices")) || [];

      const viewTemporalInvoice = Modal({
        context: `
          <div>
            <h6>
              Ingrese la informacion requerida.
            </h6>
            <form>
              <div>
                <label>
                  Monto.
                </label>
                <input type="text" class="w-full"/>
              </div>
            </form>
          </div>
        `,
        title: "Factura",
        actions: () => {

        },
        textButton: 'Siguiente'
      });

      document.body.appendChild(viewTemporalInvoice);
      modal.remove()
    },
    textButton: "Crear factura"
  });

  document.body.appendChild(modal);
});

document.querySelector("#dailySales").addEventListener("click", () => {
  if (!JSON.parse(localStorage.getItem("dataDailySale"))) {
    startTheSalesDay();
    return;
  }

  const modal = Modal({
    context: `
      <div>
        <p>
          Finaliza las ventas del día y registra el cierre
        </p>
      </div>
    `,
    title: "Cierre de Caja",
    actions: () => {
      if (localStorage.getItem("dataDailySale") === "[]") {
        return alert("No se a iniciado el dia.");
      }
      const validateTheDailyCashClosing = Modal({
        context: `
          <div>
            <p class="mb-8">
              Estás a punto de cerrar la caja y finalizar todas las ventas del día.<br /> Esta acción no se puede deshacer.
            </p>
            <div class="flex flex-col gap-3">
              <label>
                Escribe CERRAR para confirmar
              </label>
              <input type="text" class="py-6 px-4 w-full border border-gray-400 rounded-xl placeholder:text-red-600" data-id="validKeyToClosing" data-key="CERRAR" placeholder="CERRAR" />
            </div>
          </div>
        `,
        title: "Finalizar Ventas del Día",
        actions: (e) => {
          const inputValidKeyToClosing = document.querySelector(
            'input[data-id="validKeyToClosing"]',
          );

          if (
            inputValidKeyToClosing.value !== inputValidKeyToClosing.dataset.key
          )
            return;

          const dataDailySale = JSON.parse(
            localStorage.getItem("dataDailySale"),
          );

          console.log(dataDailySale);

          const cashSalesOfDay = dataDailySale.salesOfDay
            .filter((saleDay) => saleDay.methodPay === "cash")
            .reduce((acc, current) => acc + current.totalPrice, 0);

          const cardSalesOfDay = dataDailySale.salesOfDay
            .filter((saleDay) => saleDay.methodPay === "byCard")
            .reduce((acc, current) => acc + current.totalPrice, 0);

          const totalSalesOfDay = dataDailySale.salesOfDay.reduce(
            (acc, current) => acc + current.totalPrice,
            0,
          );

          const hoy = new Date();
          const formatoFecha = new Intl.DateTimeFormat("es-CL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }).format(hoy);

          const succesClosing = Modal({
            context: `
              <div class="w-lg flex flex-col gap-6">
                <div class="flex justify-between">
                  <p class="text-gray-400">
                    Fecha
                  </p>
                  <p class="font-bold">
                    ${formatoFecha}
                  </p>
                </div>
                <div class="flex justify-between">
                  <p class="text-gray-400">
                    Ventas en Efectivo
                  </p>
                  <p class="font-bold">
                    ${cashSalesOfDay.toLocaleString()}
                  </p>
                </div>
                <div class="flex justify-between">
                  <p class="text-gray-400">
                    Fondo Inicial
                  </p>
                  <p class="font-bold">
                    ${Number(dataDailySale.cashOnHand).toLocaleString()}
                  </p>
                </div>
                <div class="flex justify-between">
                  <p class="text-gray-400">
                    Efectivo en Caja
                  </p>
                  <p class="font-bold">
                    ${(cashSalesOfDay + Number(dataDailySale.cashOnHand)).toLocaleString()}
                  </p>
                </div>
                <div class="flex justify-between">
                  <p class="text-gray-400">
                    Total tarjeta (Debito y Credito)
                  </p>
                  <p class="font-bold">
                    ${cardSalesOfDay.toLocaleString()}
                  </p>
                </div>
                <div class="flex justify-between">
                  <p class="text-gray-400">
                    TOTAL VENDIDO
                  </p>
                  <p class="font-bold">
                    ${totalSalesOfDay.toLocaleString()}
                  </p>
                </div>
              </div>
            `,
            title: "Resumen del Cierre",
            actions: () => {
              const dataDailySale = JSON.parse(
                localStorage.getItem("dataDailySale"),
              );

              dataDailySale.currentDate = formatoFecha;

              const reportSalesMonth =
                JSON.parse(localStorage.getItem("reportSalesMonth")) || [];

              reportSalesMonth.push(dataDailySale);

              localStorage.setItem(
                "reportSalesMonth",
                JSON.stringify(reportSalesMonth),
              );

              localStorage.removeItem("dataDailySale");

              const successCreateReportDataDaily = Modal({
                context: `Reporte generado exitosamente.`,
                title: "Generar reporte.",
              });

              document.body.appendChild(successCreateReportDataDaily);
              setTimeout(() => {
                successCreateReportDataDaily.remove();
                succesClosing.remove();
              }, 1000);
            },
          });

          const badgeNotification = document.querySelector(
            'div[data-id="badgeNotification"]',
          );

          badgeNotification.classList.remove("hidden");

          document.body.appendChild(succesClosing);
          setTimeout(() => {
            validateTheDailyCashClosing.remove();
            modal.remove();
          }, 1000);
        },
      });

      document.body.appendChild(validateTheDailyCashClosing);
    },
  });

  document.body.appendChild(modal);
});

const deleteElemets = document.querySelector("#checkDeletAll");

document.querySelector("#listCartProducts").addEventListener("click", (e) => {
  if (e.target.tagName === "INPUT") {
    const listTrueElement = [];
    const deleteItem = document.querySelectorAll('input[data-id="deleteItem"]');

    deleteItem.forEach((input) => {
      listTrueElement.push(input.checked);
    });

    const filterElement = [...deleteItem].filter(
      (input) => input.checked === true,
    );

    if (filterElement.length !== deleteItem.length) {
      deleteElemets.checked = false;
    }

    if (filterElement.length === deleteItem.length) {
      deleteElemets.checked = true;
    }
  }
});

document
  .querySelector('button[data-id="deleteElemets"]')
  .addEventListener("click", () => {
    if (cart.length === 0) {
      const cartEmpty = Modal({
        context: "No hay articulos en el carrito",
        title: "alerta",
      });

      document.body.appendChild(cartEmpty);
      setTimeout(() => {
        cartEmpty.remove();
      }, 1000);
      return;
    }

    deleteElemets.classList.toggle("hidden");
    const liElementsItems = document.querySelectorAll('li[data-id="cartItem"]');

    liElementsItems.forEach((liItem) => {
      const div = document.createElement("div");
      div.id = "removeElements";

      if (deleteElemets.classList.contains("hidden")) {
        liItem.querySelector("#removeElements").remove();
        deleteElemets.classList.add("hidden");
        return;
      }

      div.innerHTML = `
        <input 
          type="checkbox" 
          data-id="deleteItem" 
          class="absolute right-0 top-1/2 -translate-1/2" 
        />
      `;
      liItem.appendChild(div);
    });
  });

document.querySelector("#deleteElemetSelect").addEventListener("click", () => {
  if (cart.length === 0) return;
  const deleteItem = document.querySelectorAll('input[data-id="deleteItem"]');

  const confirm = Modal({
    context: `Estas seguro de eliminar el producto`,
    title: "Eliminar productos",
    actions: () => {
      deleteItem.forEach((inputDelete) => {
        if (inputDelete.checked === true) {
          const id = Number(
            inputDelete.closest('li[data-id="cartItem"]').dataset.idproduct,
          );

          cart.splice(
            cart.findIndex((itemForDelete) => inputDelete.id === id),
            1,
          );

          localStorage.setItem("cart", JSON.stringify(cart));
        }
      });

      deleteElemets.classList.add("hidden");

      renderCartItem();
      updateCartFooter();
      confirm.remove();
    },
    textButton: "Eliminar",
  });

  document.body.appendChild(confirm);
});

document.querySelector("#checkDeletAll").addEventListener("input", (e) => {
  const deleteItem = document.querySelectorAll('input[data-id="deleteItem"]');

  let booleanCheck = e.target.checked;
  deleteItem.forEach((inputDelete) => {
    inputDelete.checked = booleanCheck;
  });
});

document.addEventListener("DOMContentLoaded", () => {

  if (!JSON.parse(localStorage.getItem("dataDailySale"))) {
    const badgeNotification = document.querySelector(
      'div[data-id="badgeNotification"]',
    );

    badgeNotification.classList.remove("hidden");
    startTheSalesDay();
  }

  console.log(userActive);
  

  document.querySelector('#businessName').textContent = isLoggin ? userActive.businessName : 'LOGOTIPO'

  renderCartItem();
});

document
  .querySelector("input[name='searchProduct']")
  .addEventListener("input", async (e) => {
    const { products } = await fetchDatabase();

    const filterProducts = products
      .filter((product) =>
        product.name
          .toLowerCase()
          .includes(e.target.value.toLowerCase().trim()),
      )
      .sort((a, b) => {
        return a.name.localeCompare(b.name);
      });

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
            <button 
              class="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-800 transition-colors"
              data-idProduct="${product.id}"
            >
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
          if (!JSON.parse(localStorage.getItem("dataDailySale"))) {
            startTheSalesDay();
            return;
          }

          const idProduct = Number(e.target.dataset.idproduct);
          const productFounded = products.find((item) => item.id === idProduct);
          let currentCount;

          if (!productFounded) {
            return;
          }

          if (productFounded.price.unit.toLowerCase() === "kg") {
            currentCount = parseFloat(prompt("¿Cuantos kilogramos?"));
          } else if (productFounded.price.unit.toLowerCase() === "unidad") {
            currentCount = Number(prompt("¿Cuantas cantidades?"));
          }

          if (currentCount === 0) {
            return
          }

          const indexItemCart = cart.findIndex(
            (itemCart) => itemCart.id === idProduct,
          );

          if (indexItemCart === -1) {
            cart.push({
              ...productFounded,
              count: currentCount,
            });
          } else {
            cart[indexItemCart].count = cart[indexItemCart].count + 1;
          }

          localStorage.setItem("cart", JSON.stringify(cart));
          renderCartItem();
        });
      });
  });
