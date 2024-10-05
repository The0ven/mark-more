"use client"

import { ForceGraph2D } from "react-force-graph"
import { PathNode, WebLinks } from "@/types/web";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ROOTNAME } from "@/data.config.client";

const addColour = (links: WebLinks) => {
        return links.map((link) => Object.assign(link, {color: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#ededed66' : '#17171766'}))
    }

export const ClientWeb = ({paths, links}: {paths: PathNode[], links: WebLinks}) => {
    const router = useRouter()
    const [graphLinks, setGraphLinks] = useState(addColour(links))
    useEffect(() => {
        if(window?.matchMedia){
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (_event) => {
                setGraphLinks(() => addColour(links))
            })
        }
    }, [links])
    if(paths.length > 0 && links.length > 0){
        return (
            <ForceGraph2D
                graphData={{
                    nodes: paths,
                    links: graphLinks
                }}
                height={Math.floor(screen.availHeight*0.5)}
                onNodeClick={(node, _event) => {
                    router.push(`/md/${node.id.split(ROOTNAME).at(-1)!}`)
                }}
            />
        )
    }
}
