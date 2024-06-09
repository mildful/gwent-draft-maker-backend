export enum Faction {
  NEUTRAL = 'NEUTRAL',
  NR = 'NR',
  NG = 'NG',
  SK = 'SK',
  ST = 'ST',
  SY = 'SY',
  MO = 'MO',
}

export const isValidFaction = (data: unknown): data is Faction => {
  return Object.values(Faction).includes(data as Faction);
}

export const isValidFactionArray = (data: unknown[]): data is Faction[] => {
  return data.every(isValidFaction);
}


export default Faction;
