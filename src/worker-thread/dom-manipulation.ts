export const VALID_MEASUREMENT_KEYS = <const>[
  'clientHeight',
  'clientLeft',
  'clientTop',
  'clientWidth',
  'scrollHeight',
  'scrollLeft',
  'scrollLeftMax',
  'scrollTop',
  'scrollWidth'
];

export const VALID_DOM_METHODS = <const>[
  'focus',
  'blur',
  'getComputedStyle'
  // TODO
  // scroll
  // scrollTo
  // scrollBy
];

export const VALID_DOM_MANIPULATIONS = [
  ...VALID_MEASUREMENT_KEYS,
  ...VALID_DOM_METHODS
];

export type ValidDOMManipulationKey =
  | typeof VALID_MEASUREMENT_KEYS[number]
  | typeof VALID_DOM_METHODS[number];

export function isValidDOMManipulation(
  name: any
): name is ValidDOMManipulationKey {
  return VALID_DOM_MANIPULATIONS.includes(name);
}

export function isValidDOMProperty(
  name: any
): name is ValidDOMManipulationKey {
  return VALID_MEASUREMENT_KEYS.includes(name);
}
export function isValidDOMMethod (
  name: any
): name is ValidDOMManipulationKey {
  return VALID_DOM_METHODS.includes(name);
}
