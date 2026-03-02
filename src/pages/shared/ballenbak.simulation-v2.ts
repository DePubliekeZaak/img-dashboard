import type { SimulationNodeDatum } from "d3";

const forceStrength = 0.125;

export class BallenbakSimulationV2 {
  s: any;

  constructor(private ctrlr: any) {
    this.init();
  }

  init() {
    this.s = window.d3.forceSimulation();

    this.s
      .force("charge", window.d3.forceManyBody().strength(forceStrength))
      .force("center", window.d3.forceCenter())
      .force("collide", window.d3.forceCollide().strength(forceStrength));
  }

  supply(data: any, groupCount?: number) {
    this.s.nodes(data as SimulationNodeDatum[]);

    this.s
      .force("collide")
      .strength(forceStrength)
      .radius((d: any) => {
        return this.ctrlr.scales.r.fn(d.value);
      });

    this.s.on("tick", (d: any) => {
      this.ctrlr.circleGroups.forceDirect();
    });
  }

  restart() {
    this.s.alphaTarget(0.3).restart;
  }

  redraw() {
    const groupWidth = this.ctrlr.dimensions.width;
    const center = {
      x: groupWidth / 2,
      y: this.ctrlr.dimensions.height / 2 - 50,
    };

    this.s.force("center").x(center.x).y(center.y);

    this.s
      .force("collide")
      .radius((d: any) => this.ctrlr.scales.r.fn(d.value) + 2);

    this.s.alphaTarget(0.3).restart;
  }
}
