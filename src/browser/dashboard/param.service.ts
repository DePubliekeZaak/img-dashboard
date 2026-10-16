import type { KeyValue } from "../../charts/core/types";
import { versions } from "../../pages/versions";
import type { Version } from "./types";

export interface IParamService {
  renew(): void;
  topic: string;
  language: string;
  version: Version;
}

export class ParamService implements IParamService {
  _params: KeyValue;
  _topic: string;
  _language: string = "nl";
  _segment: string;
  _version: Version;

  renew() {
    this._params = this._getParams();

    const primKey = Object.keys(this._params)[0];
    const primValue = Object.values(this._params)[0];

    if (primValue === "undefined" || "language") {
      this._topic = "regelingen";
      this._segment = "2022";
    }

    if (primKey === "topic") {
      this._topic = primValue.toString();
      this._segment = "2022";
    }

    if (
      this._params.version === undefined ||
      this._params.version === "latest"
    ) {
      this._version = {
        slug: "v1",
        tag: "latest",
        name: "Actuele versie",
      };
    } else {
      this._version = versions.find((v) => v.slug === this._params.version);
      // Unknown ?version= value: fall back to the latest version instead of
      // leaving this._version undefined (which crashed later in
      // DataService.buildUrl on `version.tag`).
      if (!this._version) {
        this._version = {
          slug: "v1",
          tag: "latest",
          name: "Actuele versie",
        };
      }
    }

    if (Object.keys(this._params).indexOf("language") > -1) {
      this._language = Object.values(this._params)[
        Object.keys(this._params).indexOf("language")
      ].toString();
    }
  }

  get topic() {
    return this._topic;
  }

  get language() {
    return this._language;
  }

  set language(lan: string) {
    this._language = lan;
  }

  get segment() {
    return this._segment;
  }

  get version() {
    return this._version;
  }

  _getParams(): KeyValue {
    const params = {};
    const parser = document.createElement("a");
    parser.href = window.location.href;
    const query = parser.search.substring(1);
    if (!query) return params;
    const vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split("=");
      const key = pair[0];
      if (!key) continue;
      let value = pair[1] ?? "";
      // Malformed percent-encoding (e.g. a lone "%" from query fuzzing) throws
      // in decodeURIComponent and would break the whole dashboard on load.
      // Keep the raw value instead of crashing.
      try {
        value = decodeURIComponent(value);
      } catch {
        // keep raw value
      }
      params[key] = value;
    }

    return params;
  }
}
