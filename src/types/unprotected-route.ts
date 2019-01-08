export class UnprotectedRoute {
  path: string;
  method: string;

  constructor(route: UnprotectedRoute) {
    Object.assign({}, route);
  }
}