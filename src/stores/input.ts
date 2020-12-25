import { writable } from 'svelte/store';

import type { TInput } from '../types';
import { DataType, MapView } from '../types';

const initialState: TInput = {
  dataType: DataType.Cost,
  days: 1,
  hours: 0,
  costType: {
    name: 'Мобильный',
    multiplier: 0.5,
  },
  mapView: MapView.Map,
};

function createStore() {
  const { subscribe, set, update } = writable<TInput>(initialState, () => {

  });

  return {
    subscribe,
    setDataType: (dataType: TInput['dataType']) => update(state => ({ ...state, dataType })),
    setDays: (days: TInput['days']) => update(state => ({ ...state, days })),
    setHours: (hours: TInput['hours']) => update(state => ({ ...state, hours })),
    setCostType: (costType: TInput['costType']) => update(state => ({ ...state, costType })),
    setMapView: (mapView: TInput['mapView']) => update(state => ({ ...state, mapView })),
  };
}

export const input = createStore();
