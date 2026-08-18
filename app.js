import { activeUser,login, session, userLogin } from "./src/scripts/auth.js";
import { Modal } from "./src/components/modal/modal.js";

document.addEventListener("DOMContentLoaded", () => new main());

const main = class Main {
  constructor() {
    this.btnMenuToggle = document.querySelector("#btnMenuToggle");
    this.menuToggle = document.querySelector("#menuToggle");
    this.userSaveLocal = document.querySelector("#userSaveLocal");
    this.loginUser = document.querySelector("#loginUser");
    this.userEmail = document.querySelector("#userEmail");
    this.passHashClientInput = document.querySelector("#passHashClient");
    this.btnFormLogin = document.querySelector("#btnFormLogin");
    this.init();
  }
  init() {
    if (session) {
      window.location.href = "index.html";
      return;
    }

    if (activeUser) {
      this.userSaveLocal.textContent = userLogin().username;
      this.userEmail.closest(".w-80.mx-auto").classList.add("hidden");
    }

    const resetForm = (form) => {
      form.reset();
      this.btnFormLogin.classList.add("disable");
    };

    const verifyInputValue = ({ name, value }) => {
      if (value.trim().length === 0 || value.trim() === "") {
        this.userEmail.classList.add("outline-red-400", "text-red-400");
        this.passHashClientInput.classList.add(
          "outline-red-400",
          "text-red-400",
        );
      } else {
        this.userEmail.classList.remove("outline-red-400", "text-red-400");
        this.passHashClientInput.classList.remove(
          "outline-red-400",
          "text-red-400",
        );
      }
    };

    [this.userEmail, this.passHashClientInput].forEach((input, i) => {
      input.addEventListener("input", (e) => {
        if (
          i ===
          [this.userEmail, this.passHashClientInput].filter((input) =>
            input.closest(".w-80.mx-auto").classList.contains("hidden")
              ? input.closest(".w-80.mx-auto").classList.contains("hidden")
              : [this.userEmail, this.passHashClientInput],
          ).length -
            1
        ) {
          this.btnFormLogin.classList.remove("disable");
        }

        if (this.passHashClientInput.value === "") {
          this.btnFormLogin.classList.add("disable");
        }

        verifyInputValue({
          name: e.target.name,
          value: e.target.value,
        });
      });
    });

    this.loginUser.addEventListener("submit", (e) => {
      e.preventDefault();
      const valueRutClientInput = this.userEmail.value;
      const valuePassHashClientInput = this.passHashClientInput.value;

      const res = login({
        userEmail: valueRutClientInput,
        passHashUser: valuePassHashClientInput,
      });

      if (!res) {
        const errorModal = Modal({
          context: "Error al ingresar",
          title: "Error",
        });
        document.body.appendChild(errorModal);
      } else {
        window.location.href = "index.html";
      }
      
      resetForm(this.loginUser);
    });
  }
};
