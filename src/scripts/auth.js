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

  login(isLoggin) {
    if (!isLoggin) return false;

    if (this.verifyLoginActive()) {
      this.initSession(this.user);
      return true;
    }

    this.initSession(this.user);
    return true;
  }

  initSession(started) {
    this.activeUser = started;
    this.activeSession = started;
    
    this.authToken = "yew736jso";
    // localStorage.setItem("token", JSON.stringify(this.authToken));
    
    localStorage.setItem("session", JSON.stringify(this.activeSession));
    localStorage.setItem("activeUser", JSON.stringify(this.activeUser));
    localStorage.setItem("user", JSON.stringify(this.user));
  }

  verifySessionActive() {
    return this.activeSession;
  }

  verifyLoginActive() {
    return this.activeUser;
  }
}

const auth = new Auth();
const userDatabase = getDatabase("business");

export const session = auth.verifySessionActive();
export const activeUser = auth.verifyLoginActive();

export const loginForEmail = (credenctials) => {
  const userFounded = userDatabase.find((business) =>
    credenctials.userEmail !== ""
      ? business.user.userEmail === credenctials.userEmail
      : business.user.userEmail === auth.user.userEmail,
  );

  const isValidCredential = validateOfCredentials(
    credenctials,
    userFounded.user,
  );

  auth.user = {
    username: userFounded.user.userFirstNames,
    userEmail: userFounded.user.userEmail,
    businessName: userFounded.businessInformation.businessName,
  };

  return auth.login(isValidCredential);
};

const validateOfCredentials = (credenctials, userFounded) => {
  let isValidcredentials = false;
  Object.keys(credenctials).forEach((keyCredetial) => {
    if (Object.keys(userFounded).includes(keyCredetial)) {
      if (credenctials[keyCredetial] !== userFounded[keyCredetial]) {
        isValidcredentials = false;
      } else {
        isValidcredentials = true;
      }
    }
  });
  return isValidcredentials;
};

export const loginForDNI = (credenctials) => auth.login(false);
export const userLogin = () => auth.user;
