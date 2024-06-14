import { IGraphControllerV3 } from "../../charts/core/graph-v3";
import { IPageController } from "./page.controller";
import { DataObject, TableData, ImgData } from "./types";
import { Definitions } from "./types_graphs";

export interface IParameterMapping {

    label: string,
    label_en?: string,
    column: string,
    scale?: string,
    colour: string,
    group?: string,
    short?: string,
    units? : string,
    format? : string,
    description? : string
    excludeFromTable? : boolean
}

export interface IGraphMappingV2 {

    slug: string,
    ctrlr: string
    multiples?: string,
    args?: string[],
    filters?: string[],
    parameters: IParameterMapping[][],
    modifiers?: IParameterMapping[][]
}

export type IMappingOption = IParameterMapping | boolean;



export interface IGroupMappingV2 {

    slug: string,
    ctrlr: string,
    filters?: string[],
    header: string | null,
    header_en?: string | null,
    description: string | null,
    description_en?: string | null,
    endpoints: string[],
    segment: string,
    publishDate?: string,
    functionality?: string[],
    graphs : IGraphMappingV2[],
    splice?: boolean,
}

export type IPageMapping = IGroupMappingV2[];

export interface GroupObject {

    slug: string,
    ctrlr: IGroupCtrlr,
    splice?: boolean,
    graphs: GraphObject[],
    filters?: string[],
    config: IGroupMappingV2,
    element: HTMLElement,
    data: any
}

export interface GraphObject {
    slug : string,
    multiples: string | boolean,
    ctrlrName: string,
    parameters: IParameterMapping,
    modifiers: IParameterMapping,
    filters: string[],
    ctrlr : IGraphControllerV3
}

export interface IGroupCtrlr {

    slug: string,   
    config: IGroupMappingV2,
    page: IPageController,
    segment: string,
    filters: string[],
    element: HTMLElement | null,
    graphWrapper: HTMLElement | null,
    groupWrapper: HTMLElement | null,
    html: () => HTMLElement | undefined,
    prepareData: (data:any) => DataObject,
    populateTable: (tableData: TableData) => void,
    populateDefinitions: (definitions: Definitions) => void,
    populateDescription?: () => void,
    armTabs: () => void,
    update: (data: DataObject, segment: string, update: boolean) => void
    
}






