import type { IGraphControllerV3 } from "../charts/core/graph-v3";
import type { IPageController } from "./page.controller";
import {
  type DataObject,
  ImgData,
  type Segment,
  TableData,
  Timeline,
} from "./types";
import type { Definitions } from "./types_graphs";

export interface GraphParamEntry {
  base: IParameterMapping;
  variants: Record<string, IParameterMapping>;  // "cumul" | "delta" | "base"
}

export interface IModifierMapping {
  cumul: string;   // suffix for cumulative, e.g. "_cumul"
  delta: string;   // suffix for delta/incremental, e.g. "_aantal" or "_verschil"
}

export interface IParameterMapping {
  label: string;
  label_en?: string;
  column: string;
  scale?: string;
  colour: string;
  group?: string;
  short?: string;
  units?: string;
  format?: string;
  description?: string;
  excludeFromTable?: boolean;
  modifiers?: IModifierMapping
}

export interface IGraphMappingV2 {
  slug: string;
  ctrlr: string;
  multiples?: string;
  args?: string[];
  filters?: string[];
  parameters: IParameterMapping[][];
  modifiers?: IParameterMapping[][];
  segment?: Segment;
  classList?: string[];
  header?: string;
}

export type IMappingOption = IParameterMapping | boolean;

export interface IGroupMappingV2 {
  slug: string;
  ctrlr: string;
  filters?: string[];
  header?: string | null;
  header_en?: string | null;
  datum?: string | undefined;
  description?: string | null;
  description_en?: string | null;
  definitions?: string[];
  timeline?: string[];
  endpoints?: string[];
  segment?: string | Segment;
  publishDate?: string;
  functionality?: string[];
  graphs: IGraphMappingV2[];
  splice?: boolean;
}

export interface IPageConfig {
  slug: string;
  segment: Segment;
  filters: string[];
  endpoints: string[]; // default voor alle groups
  groups: IGroupMappingV2[];
}

export interface GroupObject {
  slug: string;
  ctrlr: IGroupCtrlr;
  splice?: boolean;
  graphs: GraphObject[];
  filters?: string[];
  graphParams?: Record<string, GraphParamEntry>;
  tableParams?: any[];
  config: IGroupMappingV2;
  element: HTMLElement;
  data: any;
  resolvedEndpoints: string[];
}

export interface GraphObject {
  slug: string;
  multiples: string | boolean;
  ctrlrName: string;
  parameters: IParameterMapping;
  modifiers: IParameterMapping;
  filters: string[];
  segment: Segment;
  ctrlr: IGraphControllerV3;
  classList: string;
  header?: string | undefined;
}

export interface IGroupCtrlr {
  slug: string;
  config: IGroupMappingV2;
  page: IPageController;
  segment: Segment;
  filters: string[];
  element: HTMLElement | null;
  graphWrapper: HTMLElement | null;
  groupWrapper: HTMLElement | null;
  group: any;
  // graphParams?: Record<string, {
  //   base: IParameterMapping;
  //   variants: Record<string, IParameterMapping>;
  // }>;
  paramsAndModifiers: () => { tableParams: IParameterMapping[]; graphParams: Record<string, { base: IParameterMapping; variants: Record<string, IParameterMapping>;}>};
  html: () => HTMLElement | undefined;
  prepareData: (data: any) => DataObject;
  populateTable: (data: DataObject) => void;
  populateDefinitions: (definitions: Definitions) => void;
  populateDescription?: () => void;
  armTabs: () => void;
  update: (
    data: DataObject,
    segment: Segment | undefined,
    update: boolean,
  ) => void;
}
