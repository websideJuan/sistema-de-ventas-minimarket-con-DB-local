import { auth } from "./src/scripts/auth.js";
import { Modal } from "./src/components/modal/modal.js"

document.addEventListener("DOMContentLoaded", () => new main());

const main = class Main {
  constructor() {
    this.btnMenuToggle = document.querySelector('#btnMenuToggle')
    this.menuToggle = document.querySelector('#menuToggle')
    this.userSaveLocal = document.querySelector('#userSaveLocal')
    this.loginUser = document.querySelector('#loginUser')
    this.rutClientInput = document.querySelector('#rutClient')
    this.passHashClientInput = document.querySelector('#passHashClient')
    this.btnFormLogin = document.querySelector('#btnFormLogin')
    this.init();
  }
  init() {
    if (auth.verifyLoginActive()) {
      this.userSaveLocal.textContent = auth.user.username
      this.rutClientInput.closest('.w-80.mx-auto.mb-4').classList.add('hidden')
      return
    }

    this.loginUser.addEventListener('submit', (e) => {
      e.preventDefault()
      const valueRutClientInput = this.rutClientInput.value
      const valuePassHashClientInput = this.passHashClientInput.value
      
      const res = auth.loginUser({
        username: valueRutClientInput,
        passHashUser: valuePassHashClientInput
      })

      if (!res) {
        const errorModal = Modal({
          context: 'Error al ingresar',
          title: 'Error',
        })

        document.body.appendChild(errorModal)
        return
      }
      

      window.location.href = "index.html"
    })
  }
};
