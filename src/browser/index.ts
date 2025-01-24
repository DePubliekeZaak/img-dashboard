import '../../styling/main.scss'
import { DashboardController } from "./dashboard/dashboard.controller";


const init = () => {

    const attribute = 'img-graph-preset';
    const graphElements = [].slice.call(document.querySelectorAll("[" + attribute + "]"));

    for (let el of graphElements) {

        const graph = el.getAttribute(attribute);       

        switch (graph) {
            case 'dashboard':
                new DashboardController();
                break;
        }
    }
}

window.addEventListener('load', function (e) {
    init();
}, false);

