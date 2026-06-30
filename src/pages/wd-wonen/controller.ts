import type { IDashboardController } from "../../browser/dashboard/dashboard.controller";
import type { Version } from "../../browser/dashboard/types";
import PageController from "../../shared/page.controller";
import config from "./config";
import graphs from "./graphs";
import groups from "./groups";

export default class Controller extends PageController {
  async init(version: Version) {
    await super.init(config, groups, graphs, version);
  }
}
