import { DataPath } from "@/types/config"
import { WebLinks } from "@/types/web"
import { readFile } from "fs/promises"
import { glob } from "fast-glob"
import { ROOTNAME } from "./data.config.client"

export const DataPaths = async(path?: string): Promise<Array<DataPath>> => {
    /* @ts-expect-error: matching not typed */
    return await glob(process.cwd() + `/${ROOTNAME}${path ? path : ''}/**/*.md`)
}
export const Title: string = "Mark-More"
export const Cache = async(): Promise<WebLinks|null> => {
    try {
        return JSON.parse(await readFile(process.cwd() + "data/config.json", 'utf8')) 
    } catch {
        return null
    }
}
