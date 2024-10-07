import { DataPath } from "@/types/config"
import { glob } from "fast-glob"
import { ROOTNAME } from "./data.config.client"

export const DataPaths = async(path?: string): Promise<Array<DataPath>> => {
    /* @ts-expect-error: matching not typed */
    return await glob(process.cwd() + `/${ROOTNAME}${path ? path : ''}/**/*.md`)
}
export const Title: string = "Mark-More"
export const BACKENDHOST = "http://localhost:8000"
