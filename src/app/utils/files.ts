import { ROOTNAME } from "@/data.config.client"

export const path2Title = (path: string) => path.split("/").at(-1)?.split('.')[0]
export const relative2Absolute = (path: string) => process.cwd() + `/${ROOTNAME}/${path}`
