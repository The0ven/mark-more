import { DataPath } from "./config";

export type WebPaths = DataPath[]
export type PathNode = {
    id: string,
    name?: string,
    color: string
}
export type WebLink = {
    source: DataPath,
    target: DataPath,
    color?: string
}
export type WebLinks = WebLink[]
