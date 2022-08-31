export class NewRouteMessage {
  newPath: string;

  constructor(newPath: string) {
    this.newPath = newPath;
  }
}

export class DepartmentSelectedMessage {
  newDepartment: string;
  cities: string[];

  constructor(newDepartment: string, cities: string[]) {
    this.newDepartment = newDepartment;
    this.cities = cities;
  }
}

export class PeriodSelectedMessage {
  newPeriod: number;

  constructor(newPeriod: number) {
    this.newPeriod = newPeriod;
  }
}

export class FunctionalAreaSelectedMessage {
  newFunctionalArea: number;

  constructor(newFunctionalArea: number) {
    this.newFunctionalArea = newFunctionalArea;
  }
}

export type Message =
  | NewRouteMessage
  | DepartmentSelectedMessage
  | PeriodSelectedMessage
  | FunctionalAreaSelectedMessage;
