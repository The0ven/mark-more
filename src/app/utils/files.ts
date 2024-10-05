import { ROOTNAME } from "@/data.config.client"
import { glob } from "fast-glob"


export const path2Title = (path: string) => path.split("/").at(-1)?.split('.')[0]
export const relative2Absolute = (path: string) => process.cwd() + `/${ROOTNAME}/${path}`
export const findPermaLink = async(permaLink: string) => {
    const hrefs = await glob(process.cwd() +`/**/${permaLink}.md`)
    if(hrefs.length > 0){
        return hrefs[0]
    } else {
        return ''
    }
}
