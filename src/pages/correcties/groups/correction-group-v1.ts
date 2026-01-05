import { GroupControllerV1 } from "../../shared/group-v1";
import { IGroupMappingV2 } from "../../shared/interfaces";
import { ImgData } from "../../shared/types";
import { TableData } from "../../shared/types_graphs";

export class CorrectionGroupV1 extends GroupControllerV1 {
  constructor(
    public page: any,
    public config: IGroupMappingV2,
    public index: number,
  ) {
    super(page, config, index);
  }

  html() {

    console.log(1)

    const graphWrapper = super.html();

    const container = document.createElement("div");
    container.classList.add("graph-container-12");

    const archiveLink = document.createElement("span");

    archiveLink.classList.add("correctie");
    archiveLink.innerText = "Bekijk archiefversie";

    archiveLink.addEventListener("click", () => {
      this.page.main.switchVersion(this.config.slug);
    });

    container.appendChild(archiveLink);

    graphWrapper.appendChild(container);

    // const articleHeader = graphWrapper;
    // console.log(articleHeader);

    container.style.position = "relative";
    container.style.zIndex = "1";
    container.style.marginTop = "-2rem";

    return graphWrapper;
  }

  async init() {}

  prepareData(data: ImgData): any {
    let { tableParams, graphData, definitions, graphData_alt, timeline } =
      super.prepareData(data);

    return {
      // current: graphData[0],
      graphData,
      graphData_alt,
      tableParams,
      definitions,
      timeline,
    };
  }

  populateTable(tableData: TableData) {
    super.populateTable(tableData);
  }
}
