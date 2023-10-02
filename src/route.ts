export interface Route {
  name: string;
  method: string;
  path: string;
  action: (request: Request) => Response;
  parameters: Map<string, string>;
}
