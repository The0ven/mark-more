"use client"

import { ForceGraph2D } from "react-force-graph"
import { WebLinks } from "@/types/web";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const ClientWeb = ({paths, links}: {paths: any[], links: WebLinks}) => {
    const router = useRouter()
    const addColour = () => {
        return links.map((link) => Object.assign(link, {color: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#ededed' : '#171717'}))
    }
    const [graphLinks, setGraphLinks] = useState(addColour())
    useEffect(() => {
        if(window?.matchMedia){
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (_) => {
                setGraphLinks(addColour)
            })
        }
    }, [])
    if(paths.length > 0 && links.length > 0){
        return (
            <ForceGraph2D
                graphData={{
                    nodes: paths,
                    links: graphLinks
                }}
                height={Math.floor(screen.availHeight*0.5)}
                onNodeClick={(node, event) => {
                    router.push(`/md/${node.id.split('/').at(-1)}`)
                }}
            />
        )
    }
}
