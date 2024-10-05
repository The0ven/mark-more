import { PathNode, WebLinks, WebPaths, WebLink } from "@/types/web";
import { DataPath } from "@/types/config"
import { readFileSync } from "fs";
import { Cache } from "@/data.config";
import { unified } from "unified";
import remarkParse from "remark-parse";
import wikiLinkPlugin from "remark-wiki-link";
import flatFilter from 'unist-util-flat-filter';
import { Node as UnistNode } from 'mdast'
import { ClientWeb } from "./ClientWeb";
import { path2Title } from "../utils/files";

const path2node = (path: DataPath): PathNode => {
    return {
        id: path,
        name: path2Title(path),
        color: "#A57F60"
    }
}

const getLinks = (paths: WebPaths) => {
    Cache().then(c => {
        if(c){
            return c
        }
    })
    const links: WebLinks = paths.reduce((prev: WebLinks, curr: DataPath) => {
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
                    return {
                        source: curr,
                        target: paths.filter(s => path2Title(s) === node.value)[0],
                    }
                }).filter((link: WebLink) => (link.target && link.source && paths.includes(link.target)))
            ]
        } else {
            return [...prev]
        }
    }, [])
    return links
}

export const GenericWeb = ({paths, links}: {paths: WebPaths, links?: WebLinks}) => {
    paths = paths.filter((p) => !p.includes('undefined'))
    if(!links){
        links = getLinks(paths)
    }
    return <ClientWeb paths={paths.map(path2node)} links={links} />
}
