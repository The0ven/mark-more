import { PathNode, WebLinks, WebPaths, WebLink } from "@/types/web";
import { DataPath } from "@/types/config"
import { unified } from "unified";
import remarkParse from "remark-parse";
import wikiLinkPlugin from "remark-wiki-link";
import flatFilter from 'unist-util-flat-filter';
import { path2Title } from "../utils/files";
import { GetCache, PutCache } from "../utils/cache";
import { BACKENDHOST } from "@/data.config";
import dynamic from "next/dynamic";

const path2node = (path: DataPath, links: WebLinks): PathNode => {
    return {
        id: path,
        name: path2Title(path),
        color: "#A57F60",
        val: links.filter(l=>l.target === path).length
    }
}

const normalizeVal = (paths: PathNode[]): PathNode[] => {
    const vals = paths.map(p => p.val)
    const min = Math.min(...vals)
    const max = Math.max(...vals)
    return paths.map(p => Object.assign(p, {val: (p.val - min)/(max - min) * 5 + 1}) )
}

const handleTree = (data: string, curr: DataPath, paths: WebPaths) => {
    const tree = unified()
        .use(remarkParse, {gfm: true})
        .use(wikiLinkPlugin, {aliasDivider: '|'})
        .parse(data)
    const currLinks = flatFilter(tree, node => node.type === "wikiLink")
    // @ts-ignore
    if(currLinks && currLinks.children.length > 0){
        // @ts-ignore
        return currLinks.children.map((node: Literal) => {
            return {
                source: curr,
                target: paths.filter(s => path2Title(s) === node.value)[0],
            }
        }).filter((link: WebLink) => (link.target && link.source && paths.includes(link.target)))
    } else {
        return []
    }
}

const getLinks = async (paths: WebPaths) => {
    const cache = await GetCache()
    if(cache){
        return cache
    }
    const links: WebLinks = []

    for (const curr of paths){
        const url = `${BACKENDHOST}/read/${encodeURIComponent(curr)}`
        const body = await fetch(url)
        const text = await body.text()
        links.push(...handleTree(text, curr, paths))
    }
    await PutCache(links)
    return links
}

const ClientWeb = dynamic(
    () => import('./ClientWeb'),
    { ssr: false }
)

export const GenericWeb = async({paths, links}: {paths: WebPaths, links?: WebLinks}) => {
    paths = paths.filter((p) => !p.includes('undefined'))
    if(!links){
        links = await getLinks(paths)
    }
    return <ClientWeb paths={normalizeVal(paths.map(p=>path2node(p, links)))} links={links} />
}
