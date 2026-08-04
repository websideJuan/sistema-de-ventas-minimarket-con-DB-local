class Auth {
  authToken;
  activeUser;
  activeSession;
  user;
  passUser;
  constructor() {
    this.passUser = "1234";
    this.authToken = "";
    this.activeUser = JSON.parse(localStorage.getItem("activeUser")) || false;
    this.activeSession = JSON.parse(localStorage.getItem("session")) || false
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
    this.activeSession = true;
    this.authToken = "yew736jso";

    localStorage.setItem('session', JSON.stringify(true))
    localStorage.setItem("activeUser", JSON.stringify(true));
    localStorage.setItem("user", JSON.stringify({
      username: user.username,
      passHashUser: ''
    }));
  }

  verifySessionActive() {
    return this.activeSession
  }

  verifyLoginActive() {
    return this.activeUser;
  }
}

export const auth = new Auth();
