import { Route } from './route';

export interface RouteMapNode {
  segmentName: string;
  route: Route | null;
  children: Map<string, RouteMapNode>;
  isParameter: boolean;
}
