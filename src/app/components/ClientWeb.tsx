"use client"

import { ForceGraph2D } from "react-force-graph"
import { WebLinks } from "@/types/web";

export const ClientWeb = ({paths, links}: {paths: any, links: WebLinks}) => {
    return (
        <ForceGraph2D
            graphData={{
                nodes: paths,
                links: links
            }}
        />
    )
}
