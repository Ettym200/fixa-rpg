export function calcModifier(value: number | string): number {
  const v = Number(value || 0);
  return Math.floor((v - 10) / 2);
}

export function calcDefense(desMod: number, armor = 0, shield = 0, others = 0): number {
  return 10 + Number(desMod || 0) + Number(armor || 0) + Number(shield || 0) + Number(others || 0);
}

export function calcSkill(level: number, attrMod: number, trained = 0, others = 0): number {
  return Math.floor(Number(level || 0) / 2) + Number(attrMod || 0) + Number(trained || 0) + Number(others || 0);
}

export function calcLoadLimit(forValue: number): number {
  return 10 + 2 * Number(forValue || 0);
}

export function metersToFeet(meters: number): number {
  return Math.round(Number(meters || 0) * 3.28084);
}

