class DataBase {
  currentDataBase;
  error;
  typeError;
  dataBase;
  constructor() {
    this.dataBase = localStorage;
    this.currentDataBase = JSON.parse(localStorage.getItem('business')) || [];
    this.error = false;
    this.typeError = "";
  }

  GET(business) {
    if (this.currentDataBase === null) {
      this.error = true;
      this.typeError = "local database is not define";
      throw new Error(this.typeError);
    }
    return this.currentDataBase;
  }

  POST(business = "", database = {}) {
    this.currentDataBase = this.GET(business);

    if (this.errors) {
      throw new Error(this.typeError);
    }

    this.currentDataBase.push({
      ...database,
      id: crypto.randomUUID(),
      createdAt: '',
      updatedAt: ''
    })

    this.dataBase.setItem(business, JSON.stringify(this.currentDataBase));

    return true;
  }

  PUT(id, database) {}

  DELETE(id) {}
}

const connect = new DataBase();

export const createDatabase = (business, database ) =>
  connect.POST(business, database);

export const getDatabase = (business) => connect.GET(business);
