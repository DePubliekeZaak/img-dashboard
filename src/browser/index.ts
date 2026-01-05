import * as d3 from 'd3';
(window as any).d3 = d3;

import '../../styling/main.scss'
import { DashboardController } from "./dashboard/dashboard.controller";


const init = () => {

    const graphElements = [].slice.call(document.querySelectorAll("[img-graph-preset='dashboard'], [data-img-graph-preset='dashboard']"));

    for (let el of graphElements) {

        const graph = 'dashboard' // el.getAttribute(attribute);       

        switch (graph) {
            case 'dashboard':
                new DashboardController();
                break;
        }
    }

    addStylesheets()


}

const addStylesheets = () => {
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        // @ts-ignore
        link.href = "https://img.publikaan.nl" + '/graphs/styles/main.css?v=2'; //; //  ; //  graphObject
        link.media = 'all';
        head.appendChild(link);
}

window.addEventListener('load', function (e) {
    init();
}, false);

