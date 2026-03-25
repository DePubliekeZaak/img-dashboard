import { Version } from "./types";

export interface IDataService {
  clear: () => void;
  collection: () => { [key: string]: any };
  gather: (endpoint: string, version: Version) => void;
  fetch: (endpoint: string, version: Version) => Promise<any>;
}

export class DataService implements IDataService {
  _collection = {};

  constructor() {}

  collection() {
    return this._collection;
  }

  clear() {
    this._collection = {};
  }

  async gather(endpoint: string, version: Version) {
    if (this._collection[endpoint] == undefined) {
      this._collection[endpoint] = await this.fetch(endpoint, version);
    }
  }

  async fetch(endpoint: string, version: Version): Promise<any> {
    return new Promise(async (resolve, reject) => {
      // @ts-ignore
      let apibase = APIBASE;
      // @ts-ignore
      let domain = DOMAIN;

      if (version.tag != "latest") {
        apibase =
          "/" + apibase.split("/")[1] + "/archives/v" + version.slug + "/api/";
      }

      // if (endpoint.includes("tevredenheid")) {
      //   apibase = "/open-data/api/";
      // }

      const url = domain + apibase + endpoint;
      console.log(url);
      const response = await fetch(url);
      if (response.ok) {
        resolve(response.json());
      } else {
        reject();
      }
    });
  }
}
