import { BACKENDHOST } from "@/data.config"
import { WebLinks } from "@/types/web"
import { writeFile } from "fs/promises"

export const GetCache = async(): Promise<WebLinks|null> => {
    try {
        const content = await (await fetch(`${BACKENDHOST}/read/${process.cwd() + "data/config.json"}`)).text()
        return JSON.parse(content) 
    } catch {
        return null
    }
}

export const PutCache = async(data: object) => {
    await writeFile(process.cwd() + "/data/config.json", JSON.stringify(data))
}
