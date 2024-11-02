import { randomInt } from "crypto";

export const PrincessList = new Map([
  ["elder", ["Celestia", "Luna", "Cadance"]],
  ["young", ["Twilight", "Sunset", "Fallenstar", "Moonlight"]],
]);

export const getRndPrincess = (category) => {
  if (PrincessList.has(category)) {
    const list = PrincessList.get(category);
    return list[randomInt(list.length)];
  }
};
