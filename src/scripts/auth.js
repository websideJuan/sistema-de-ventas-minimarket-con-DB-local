import { getDatabase } from "../scripts/database.js";

class Auth {
  authToken;
  activeUser;
  activeSession;
  user;
  passUser;

  constructor() {
    this.authToken = "";
    this.activeUser = JSON.parse(localStorage.getItem("activeUser")) || false;
    this.activeSession = JSON.parse(localStorage.getItem("session")) || false;
    this.user = JSON.parse(localStorage.getItem("user")) || {};
  }

  loginUser({ userEmail, passHashUser }) {
    const userDatabase = getDatabase("business");
    const userFounded = userDatabase.find((business) => business.user.userEmail === userEmail);
    

    if (userFounded === undefined) {
      return false;
    }

    if (
      passHashUser !== userFounded.user.userCredHas ||
      userEmail !== userFounded.user.userEmail
    ) {
      return false;
    }

    
    if (this.verifyLoginActive()) {
      this.initSession(this.user);
      return true;
    }

    this.user.username = userFounded.user.userFirstNames;
    this.user.userEmail = userFounded.user.userEmail;
    
    this.initSession(this.user);
    return true;
  }

  initSession(user) {
    this.activeUser = true;
    this.activeSession = true;
    this.authToken = "yew736jso";

    localStorage.setItem("token", JSON.stringify(this.authToken));
    localStorage.setItem("session", JSON.stringify(true));
    localStorage.setItem("activeUser", JSON.stringify(true));
    localStorage.setItem("user", JSON.stringify({ username: user.username }));
  }

  verifySessionActive() {
    return this.activeSession;
  }

  verifyLoginActive() {
    return this.activeUser;
  }
}

const auth = new Auth();

export const session = auth.verifySessionActive();
export const activeUser = auth.verifyLoginActive();
export const login = (user) => auth.loginUser(user);
export const userLogin = () => auth.user;
