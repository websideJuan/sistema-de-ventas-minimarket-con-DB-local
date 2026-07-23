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
      </div>
    `;
  });
};

const startTheSalesDay = () => {
  const dataDailySale = JSON.parse(localStorage.getItem("dataDailySale"));

  if (!dataDailySale) {
    const notDataDaily = Modal({
      context: `No has iniciado las ventas!`,
      title: "Accion requerida",
    });

    document.body.appendChild(notDataDaily);
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
                     <input class="w-full py-4 ps-4 border border-gray-400 rounded-xl" type="text" name="cashOnHand" data-id="cashOnHand" placeholder="10.000, 15.000, 20.000" required />
                   </div>
                   <div class="mb-6">
                     <label for="sellerName" class="mb-3 text-gray-600 block">
                       Nombre del vendedor
                     </label>
                     <input class="w-full py-4 ps-4 border border-gray-400 rounded-xl" type="text" name="sellerName" data-id="sellerName" placeholder="Nombre del vendedor" required />
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

          const dataDailySale = JSON.parse(
            localStorage.getItem("dataDailySale"),
          );

          dataDailySale.cashOnHand = cashOnHand.value;
          dataDailySale.seller = sellerName.value;

          localStorage.setItem("dataDailySale", JSON.stringify(dataDailySale));

          const successCreateDataDailySale = Modal({
            context: "Has iniciado el dia de forma correcta!",
            title: "Inicia dia de ventas.",
          });

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
};

document.querySelector("#initDailySale").addEventListener("click", (e) => {
  const dataDailySale = JSON.parse(localStorage.getItem("dataDailySale"));
  if (!dataDailySale) {
    localStorage.setItem(
      "dataDailySale",
      JSON.stringify({
        cashOnHand: 0,
        seller: "",
        salesOfDay: [],
      }),
    );

    e.target.querySelector('div[data-id="badgeNotification"]').remove();
  }

  if (dataDailySale && Number(dataDailySale.cashOnHand) > 0) {
    const modal = Modal({
      context: `Ya iniciaste el dia de ventas.`,
      title: "Ventas",
      actions: null,
    });

    document.body.appendChild(modal);
    return;
  }

  startTheSalesDay();
});

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
            let dailySalesReport = {};

            if (radio.checked === true) {
              if (radio.dataset.id === "cash") {
                answer = prompt("Ingresa el monto pagado.");
                dailySalesReport.amountPaid = answer;
              } else {
                answer = prompt("Opere su tarjeta.");
                dailySalesReport.codeOperation = answer;
              }

              localStorage.setItem("cart", JSON.stringify([]));
              cart = [];
              console.log(cart);
              
              renderCartItem();

              dailySalesReport.methodPay = radio.dataset.id;
              dailySalesReport.totalPrice = totalPrice;

              const dataDailySale =
                JSON.parse(localStorage.getItem("dataDailySale")) || [];

              dataDailySale.salesOfDay.push(dailySalesReport);

              localStorage.setItem(
                "dataDailySale",
                JSON.stringify(dataDailySale),
              );

              const confirm = Modal({
                context: "Gracias por su compra!",
                title: "Compra realizada con exito!",
              });

              document.body.appendChild(confirm);

              setTimeout(() => {
                modal.remove();
                confirm.remove();
              }, 5000);
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
      <h6>
        Ingresa el numero de la factura
      </h6>
      <div>
        <input type="text" class="w-full" data-id="invoiceId" /> 
      </div>
    `,
    title: "Facturas",
    actions: () => {
      const invoices = JSON.parse(localStorage.getItem("invoices"));
      if (!invoices) {
        return alert("invoices empty");
      }

      const invoiceId = document.querySelector('input[data-id="invoiceId"]');

      console.log(`Id ingresado desde el input: ${invoiceId.value}`);

      const invoceFounded = invoices.filter(
        (invoice) => invoice.id === invoiceId.value,
      );

      if (invoceFounded.length === 0) {
        const notFoundedInvoice = Modal({
          context: "Factura no encontrada",
          title: "Facturas.",
        });
        document.body.appendChild(notFoundedInvoice);
        setTimeout(() => {
          notFoundedInvoice.remove();
        }, 1000);
        return;
      }

      console.log(`Resultado de la busqueda: ${invoceFounded}`);
      const invoceModal = Modal({
        context: invoceFounded.map((invoce) => `${invoce.name}`),
        title: "Factura",
      });

      document.body.appendChild(invoceModal);
    },
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
              <div>
            `,
            title: "Resumen del Cierre",
            actions: () => {
              const dataDailySale = JSON.parse(localStorage.getItem('dataDailySale'))
              const reportSalesMonth = JSON.parse(localStorage.getItem('reportSalesMonth')) || []

              reportSalesMonth.push(dataDailySale)

              localStorage.setItem('reportSalesMonth', JSON.stringify(reportSalesMonth))
              localStorage.removeItem("dataDailySale");

              const successCreateReportDataDaily = Modal({
                context: `Reporte generado exitosamente.`,
                title: 'Generar reporte.'
              })

              document.body.appendChild(successCreateReportDataDaily)
            },
          });

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

document.addEventListener("DOMContentLoaded", () => {
  if (!JSON.parse(localStorage.getItem("dataDailySale"))) {
    const badgeNotification = document.createElement("div");

    badgeNotification.setAttribute("data-id", "badgeNotification");
    badgeNotification.classList.add(
      "absolute",
      "-top-2",
      "-right-2",
      "bg-white",
      "rounded-xl",
      "text-red-900",
    );
    badgeNotification.innerHTML = `<i class="fa-solid fa-exclamation"></i>`;

    document.querySelector("#initDailySale").appendChild(badgeNotification);

    startTheSalesDay();
  }

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
          if (!JSON.parse(localStorage.getItem("dataDailySale"))) {
            startTheSalesDay();
            return;
          }
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
