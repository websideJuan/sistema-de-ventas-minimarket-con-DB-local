export const Modal = function ({ context, title, actions }) {
  const modal = document.createElement("div");

  modal.classList.add(
    "absolute",
    "inset-0",
    "flex",
    "justify-center",
    "items-center",
    "bg-black/50",
    "backdrop-blur-md",
  );

  modal.innerHTML = `
    <div class="bg-white shadow p-6 rounded-xl">
      <div class="flex justify-between items-center mb-6 gap-6">
        <h3 class="font-semibold text-xl">
          ${title}
        </h3>  
        <i class="fa-solid fa-xmark" data-id="closeModale"></i>
      </div>
      <div class="mb-6">
        ${context}
      </div>
      ${ 
        typeof actions === "function" ?
          `
          <div class="flex gap-3">
            <button class="bg-indigo-600 text-white py-2 w-full rounded-lg cursor-pointer hover:bg-indigo-800" data-id="save">Guardar</button>
            <button class="bg-gray-200 py-2 w-full rounded-lg cursor-pointer hover:bg-gray-300" data-id="cancel">Cancelar</button>
          </div>
          `
        : ''
      }
    </div>
  `;

  modal.addEventListener("click", (e) => {
    if (e.target.dataset.id === "closeModale") {
      modal.remove();
    }

    if (e.target.dataset.id === "save") {
      actions();
    } else if (e.target.dataset.id === "cancel") {
      modal.remove();
    }
    
  });

  return modal;
};
