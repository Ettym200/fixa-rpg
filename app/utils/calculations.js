export function calcModifier(value) {
  const v = Number(value || 0);
  return Math.floor((v - 10) / 2);
}

export function calcDefense(desMod, armor = 0, shield = 0, others = 0) {
  return 10 + Number(desMod || 0) + Number(armor || 0) + Number(shield || 0) + Number(others || 0);
}

export function calcSkill(level, attrMod, trained = 0, others = 0) {
  return Math.floor(Number(level || 0) / 2) + Number(attrMod || 0) + Number(trained || 0) + Number(others || 0);
}

export function calcLoadLimit(forValue) {
  return 10 + 2 * Number(forValue || 0);
}

export function metersToFeet(meters) {
  return Math.round(Number(meters || 0) * 3.28084);
}


