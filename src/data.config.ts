import { DataPath } from "@/types/config"
import { WebLinks } from "@/types/web"
import { readFile } from "fs/promises"
import { glob } from "fast-glob"

export const DataPaths = async(): Promise<Array<DataPath>> => {
    /* @ts-ignore */
    return glob(process.cwd() + "/data/**/*.md")
}
export const Title: string = "Mark-More"
export const Cache = async(): Promise<WebLinks|null> => {
    try {
        return JSON.parse(await readFile(process.cwd() + "data/config.json", 'utf8')) 
    } catch {
        return null
    }
}
