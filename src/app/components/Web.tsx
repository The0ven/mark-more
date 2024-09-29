import { WebLinks, WebPaths } from "@/types/web";
import { DataPath } from "@/types/config"
import { readFileSync } from "fs";
import { Cache } from "@/data.config";
import { unified } from "unified";
import remarkParse from "remark-parse";
import wikiLinkPlugin from "remark-wiki-link";
import flatFilter from 'unist-util-flat-filter';
import { Node as UnistNode } from 'mdast'
import { ClientWeb } from "./ClientWeb";

const path2node = (path: DataPath) => {
    return {
        id: path,
        name: path.split("/").at(-1)?.slice(0, -3)!,
    }
}

const getLinks = (paths: WebPaths) => {
    Cache().then(c => {
        if(c){
            return c
        }
    })
    const links: WebLinks = paths.reduce((prev: WebLinks, curr: DataPath, idx, arr) => {
        const data = readFileSync(curr, 'utf8')
        const tree = unified()
            .use(remarkParse, {gfm: true})
            .use(wikiLinkPlugin, {aliasDivider: '|'})
            .parse(data)
        const currLinks = flatFilter(tree, node => node.type === "wikiLink")
        if(currLinks && currLinks.children.length > 0){
            return [
                ...prev,
                ...currLinks.children.map((node: UnistNode) => {
                    console.log(node)
                    return {
                        source: curr,
                        target: paths.filter(s => s.split("/").at(-1)?.slice(0, -3) === node.value)[0]
                    }
                })
            ]
        } else {
            return [...prev]
        }
    }, [])
    return links
}

export const GenericWeb = ({paths, links}: {paths: WebPaths, links?: WebLinks}) => {
    if(!links){
        links = getLinks(paths)
    }
    return <ClientWeb paths={paths.map(path2node)} links={links} />
}
