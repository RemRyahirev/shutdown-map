export type TMapCoords = [number, number];

export type TRegion = {
  key: string;
  name: string;
  code: string;
  population: number;

  vrp: number;
  costIndex: number;
  cost: number;

  mobileWeight: number;
  mobileUsers: number;
  mobileWideWeight: number;
  speed: number;
  licenses: number;
  border: number;
  atlas: number;
  ix: number;
  resistance: number;

  map: TMapCoords;
  costPosition: number;
  resistancePosition: number;
};

export type TRegionMap = Record<string, TRegion>;

export type TData = {
  isLoaded: boolean;
  regions?: TRegionMap;
  regionCoords?: string[];
  cols?: number;
  rows?: number;
  totalCost?: number;
  costTypes?: Array<{
    name: string;
    multiplier: number;
  }>;
};

export enum DataType {
  Cost,
  Resistance,
}

export enum MapView {
  Map,
  Asc,
  Desc,
}

export enum CostType {
  Full,
  Mobile,
}

export type TInput = {
  dataType: DataType;
  days: number;
  hours: number;
  costType: {
    name: string;
    multiplier: number;
  };
  mapView: MapView;
};
