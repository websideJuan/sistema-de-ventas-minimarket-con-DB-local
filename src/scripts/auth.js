class Auth {
  authToken;
  activeUser;
  user;
  passUser;
  constructor() {
    this.passUser = "1234";
    this.authToken = "";
    this.activeUser = JSON.parse(localStorage.getItem("activeUser")) || false;
    this.user = {
      username: this.activeUser
        ? JSON.parse(localStorage.getItem("user")).username
        : "",
      passHashUser: "",
    };
  }

  loginUser({ username, passHashUser }) {
    if (passHashUser !== this.passUser) {
      return false;
    }

    if (this.verifyLoginActive()) {
      this.user.passHashUser = passHashUser;
      this.initSession(this.user);
      return true;
    }

    this.user.username = username;
    this.user.passHashUser = passHashUser;

    this.initSession(this.user);
    return true;
  }

  initSession(user) {
    this.activeUser = true;
    this.authToken = "yew736jso";
    localStorage.setItem("activeUser", JSON.stringify(true));
    localStorage.setItem("user", JSON.stringify(user));
  }

  verifyLoginActive() {
    return this.activeUser;
  }
}

export const auth = new Auth();
