import { IDashboardController } from "../../browser/dashboard/dashboard.controller";
import PageController from '../shared/page.controller';
import config from './config';
import groups from './groups';
import graphs from './graphs';
import { Version } from "../../browser/dashboard/types";

export default class Controller extends PageController {

    constructor(main: IDashboardController) {

        super(main);
    }

    async init(version: Version)  {

       await super.init(config, groups, graphs, version)
    }
}



