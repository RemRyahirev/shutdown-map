import { readable } from 'svelte/store';

import type { TData, TMapCoords, TRegion, TRegionMap } from '../types';
import { DataGroup } from '../types';

type TCostMap = Record<string, Pick<TRegion,
  | 'vrp'
  | 'costIndex'
  | 'cost'>>;
type TFearMap = Record<string, Pick<TRegion,
  | 'mobileWeight'
  | 'mobileUsers'
  | 'mobileWideWeight'
  | 'speed'
  | 'licenses'
  | 'border'
  | 'atlas'
  | 'ix'
  | 'resistance'>>;

const sheetUrls = {
  cost: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQk-d0aYOu8d-0MJJQxdGOt-FZHLquhLgXdMzPs13Z8JM8oxph1JPoDJgXqZI-QYZBFAxllpIoAlPGA/pub?output=csv',
  fear: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQk-d0aYOu8d-0MJJQxdGOt-FZHLquhLgXdMzPs13Z8JM8oxph1JPoDJgXqZI-QYZBFAxllpIoAlPGA/pub?gid=2064828657&single=true&output=csv',
  codes: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQk-d0aYOu8d-0MJJQxdGOt-FZHLquhLgXdMzPs13Z8JM8oxph1JPoDJgXqZI-QYZBFAxllpIoAlPGA/pub?gid=2146280542&single=true&output=csv',
};

/*
     0        1        2         3         4        5         6       7        8       9        10      11       12       13       14       15      16        17

 0 * СПб    *        *         *        * Мурмн   *        *        *        *        *       *        *        *        *        *       *        * Чукот  * Камчат
 1 * Москва *        *         * Карел  *         *        *        *        *        * НАО   * ЯНАО   *        *        * Крск   *       *        * Магад  *
 2 *        *        * Лен обл * Новг   * Влгда   *        *        *        * Архнгл * Коми  * ХМАО   * Тюмень * Томск  * Кузбас * Ирк   * Якутия * Хбрвск * Сах обл
 3 * Клнгрд *        * Псков   * Тверь  * Ярслв   * Ивнво  * Кстрма * Мар Эл * Киров  * Пермь * Екб    * Курган * Нск    * Хакас  * Бурят * Амур   *        *
 4 *        *        * Смлнск  * Калуга * Мск обл * Влдмр  * Нижний * Чуваш  * Татар  * Удмрт * Члбнск * Омск   * Алт кр * Тыва   * Збйкл * ЕАО    * Прмрск *
 5 *        *        * Брянск  * Орел   * Тула    * Рязань * Мрдв   * Ульнск * Самара * Бшкр  *        *        * Алтай  *        *       *        *        *
 6 *        *        *         * Курск  * Липецк  * Тамбов * Пенза  * Сртв   * Орнбрг *       *        *        *        *        *       *        *        *
 7 *        *        *         *        * Белг    * Врнж   * Влггрд *        *        *       *        *        *        *        *       *        *        *
 8 *        * Свстпл * Крым    * Адыгея * Кубань  * Ростов * Клмк   * Астрхн *        *       *        *        *        *        *       *        *        *
 9 *        *        *         *        * КЧР     * Ставр  * Чечня  * Дгстн  *        *       *        *        *        *        *       *        *        *
10 *        *        *         *        * КБР     * Алания * Ингуш  *        *        *       *        *        *        *        *       *        *        *
*/

const codesCoordsMap: Record<number, TMapCoords> = {
  78: [0, 0], // SPE
  77: [0, 1], // MOW
  39: [0, 3], // KGD

  92: [1, 8], // UA-40[8]

  47: [2, 2], // LEN
  60: [2, 3], // PSK
  67: [2, 4], // SMO
  32: [2, 5], // BRY
  91: [2, 8], // UA-43[8]

  10: [3, 1], // KR
  53: [3, 2], // NGR
  69: [3, 3], // TVE
  40: [3, 4], // KLU
  57: [3, 5], // ORL
  46: [3, 6], // KRS
  1: [3, 8], // AD

  51: [4, 0], // MUR
  35: [4, 2], // VLG
  76: [4, 3], // YAR
  50: [4, 4], // MOS
  71: [4, 5], // TUL
  48: [4, 6], // LIP
  31: [4, 7], // BEL
  23: [4, 8], // KDA
  9: [4, 9], // KC
  7: [4, 10], // KB

  37: [5, 3], // IVA
  33: [5, 4], // VLA
  62: [5, 5], // RYA
  68: [5, 6], // TAM
  36: [5, 7], // VOR
  61: [5, 8], // ROS
  26: [5, 9], // STA
  15: [5, 10], // SE

  44: [6, 3], // KOS
  52: [6, 4], // NIZ
  13: [6, 5], // MO
  58: [6, 6], // PNZ
  34: [6, 7], // VGG
  8: [6, 8], // KL
  20: [6, 9], // CE
  6: [6, 10], // IN

  12: [7, 3], // ME
  21: [7, 4], // CU
  73: [7, 5], // ULY
  64: [7, 6], // SAR
  30: [7, 8], // AST
  5: [7, 9], // DA

  29: [8, 2], // ARK
  43: [8, 3], // KIR
  16: [8, 4], // TA
  63: [8, 5], // SAM
  56: [8, 6], // ORE

  83: [9, 1], // NEN
  11: [9, 2], // KO
  59: [9, 3], // PER
  18: [9, 4], // UD
  2: [9, 5], // BA

  89: [10, 1], // YAN
  86: [10, 2], // KHM
  66: [10, 3], // SVE
  74: [10, 4], // CHE

  72: [11, 2], // TYU
  45: [11, 3], // KGN
  55: [11, 4], // OMS

  70: [12, 2], // TOM
  54: [12, 3], // NVS
  22: [12, 4], // ALT
  4: [12, 5], // AL

  24: [13, 1], // KYA
  42: [13, 2], // KEM
  19: [13, 3], // KK
  17: [13, 4], // TY

  38: [14, 2], // IRK
  3: [14, 3], // BU
  75: [14, 4], // ZAB

  14: [15, 2], // SA
  28: [15, 3], // AMU
  79: [15, 4], // YEV

  87: [16, 0], // CHU
  49: [16, 1], // MAG
  27: [16, 2], // KHA
  25: [16, 4], // PRI

  41: [17, 0], // KAM
  65: [17, 2], // SAK
};

function buildRating<T, K extends keyof T>(
  map: Record<string, T>,
  field: K,
): Record<string, { position: number; group: DataGroup }> {
  const positions: Array<{ key: string } & Pick<T, K>> = [];
  let total = 0;
  for (const [key, item] of Object.entries(map)) {
    const value = item[field] as unknown as number;
    positions.push({ key, [field]: value } as { key: string } & Pick<T, K>);
    total += value;
  }

  positions.sort((a, b) => {
    const aVal = a[field] as unknown as number;
    const bVal = b[field] as unknown as number;

    if (bVal === aVal) {
      return 0;
    }

    return bVal > aVal ? 1 : -1;
  });

  const positionsMap: Record<string, { position: number; group: DataGroup }> = {};
  let subtotal = 0;
  for (let iLen = positions.length, i = 0; i < iLen; ++i) {
    const item = positions[i];
    const value = item[field] as unknown as number;
    subtotal += value;

    let group: DataGroup;
    if (i === 0 || subtotal < total / 3) {
      group = DataGroup.High;
    } else if (i === iLen - 1 || subtotal >= 2 * total / 3) {
      group = DataGroup.Low;
    } else {
      group = DataGroup.Medium;
    }

    positionsMap[item.key] = {
      position: i,
      group,
    };
  }

  return positionsMap;
}

async function loadSheet(url): Promise<string[][]> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error in loading "${url}": ${response.status} ${response.statusText}`);
  }

  const text = await response.text();

  return text
    .split(/\r?\n/)
    .map(row => {
      // return row.split(/"?,"?/);
      const arr = [];
      let rest = row;
      let i = rest.indexOf(',');
      while (i !== -1) {
        if (rest[0] === '"') {
          const end = rest.indexOf('"', 1);
          arr.push(rest.substring(1, end).replace(',', '.'));
          rest = rest.substr(end + 2);
        } else {
          arr.push(rest.substr(0, i));
          rest = rest.substr(i + 1);
        }

        i = rest.indexOf(',');
      }

      if (rest[0] === '"') {
        arr.push(rest.substring(1, rest.length - 1).replace(',', '.'));
      } else {
        arr.push(rest);
      }

      return arr;
    });
}

async function loadStore({ cost, fear, codes }): Promise<TData> {
  const [cols, rows] = Object.values(codesCoordsMap)
    .reduce((dim, [col, row]) => {
      dim[0] = Math.max(dim[0], col + 1);
      dim[1] = Math.max(dim[1], row + 1);
      return dim;
    }, [0, 0]);

  const costMap: TCostMap = cost
    .slice(10)
    .reduce((map, [num, name, key, code, population, vrp, index, rub, usd]) => {
      map[key] = {
        vrp: Number(vrp),
        costIndex: Number(index),
        cost: Number(rub),
      };

      return map;
    }, {});
  const totalCost = Number(cost[7][5]);
  const costTypes = [
    { name: 'Полный', multiplier: 1 },
    { name: 'Мобильный', multiplier: 0.5 },
  ];

  const fearMap: TFearMap = fear
    .slice(1)
    .reduce((map, [num, name, key, code, population, vrp, mobile, weight, users, fixed, wide, speed256, speed5, speed20, speed100, speed, companies, licenses, _licenses, border, _border, atlas, _atlas, ix, resistance]) => {
      map[key] = {
        mobileWeight: Number(weight),
        mobileUsers: Number(users),
        mobileWideWeight: Number(wide),
        speed: Number(speed),
        licenses: Number(licenses),
        border: Number(border),
        atlas: Number(atlas),
        ix: Number(ix),
        resistance: Number(resistance),
      };

      return map;
    }, {});

  const costPositionsMap = buildRating(costMap, 'cost');
  const fearPositionsMap = buildRating(fearMap, 'resistance');

  const regions = codes
    .slice(3)
    .reduce((map, [name, key, code, population]) => {
      map[key] = {
        name,
        key,
        code: code.replace(/^\w+-(.+)$/i, '$1'),
        population: Number(population),

        ...costMap[key],
        ...fearMap[key],

        map: codesCoordsMap[key],
        costPosition: costPositionsMap[key].position,
        costGroup: costPositionsMap[key].group,
        resistancePosition: fearPositionsMap[key].position,
        resistanceGroup: fearPositionsMap[key].group,
      } as TRegion;

      return map;
    }, {} as TRegionMap);

  return {
    isLoaded: true,
    regions,
    cols,
    rows,
    totalCost,
    costTypes,
  };
}

function createStore() {
  const [cols, rows] = Object.values(codesCoordsMap)
    .reduce((dim, [col, row]) => {
      dim[0] = Math.max(dim[0], col + 1);
      dim[1] = Math.max(dim[1], row + 1);
      return dim;
    }, [0, 0]);

  const initialState: TData = {
    isLoaded: false,
    cols,
    rows,
    regionCoords: Object.values(codesCoordsMap).map(coords => coords.join(' ')),
  };

  return readable<TData>(initialState, function start(set) {
    const dataFromLS = localStorage.getItem('data');

    let data: TData;
    if (dataFromLS?.length) {
      try {
        data = JSON.parse(dataFromLS);
        set(data);

        console.log('data from cache:', data);
      } catch (e) {
        console.error('Load cached data error:', e)
      }
    } else {
      Promise
        .all([
          loadSheet(sheetUrls.cost),
          loadSheet(sheetUrls.fear),
          loadSheet(sheetUrls.codes),
        ])
        .then(
          async (
            [
              cost,
              fear,
              codes,
            ],
          ) => {
            data = await loadStore({ cost, fear, codes });
            set(data);
            localStorage.setItem('data', JSON.stringify(data));

            console.log('data from fetch:', data);
          });
    }

    return function stop() {};
  });
}

export const data = createStore();
