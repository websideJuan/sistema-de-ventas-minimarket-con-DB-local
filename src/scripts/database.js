class DataBase {
  currentDataBase;
  constructor() {
    this.dataBase = localStorage;
  }

  GET(business) {
    this.currentDataBase = JSON.parse(this.dataBase.getItem(business));

    if (this.currentDataBase === null) {
      throw new Error("local database is not define");
    }

    return this.currentDataBase;
  }

  POST(businees = "", database = {}) {
    this.dataBase.setItem(businees, JSON.stringify(database));

    return true;
  }

  PUT(id, database) {}

  DELETE(id) {}
}

const connect = new DataBase();

export const createDatabase = ({ business, database }) =>
  connect.POST(business, database);

export const getDatabase = (business) => connect.GET(business)