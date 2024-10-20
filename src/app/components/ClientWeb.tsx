"use client"

import { ForceGraph2D } from "react-force-graph"
import { PathNode, WebLinks } from "@/types/web";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ROOTNAME } from "@/data.config.client";

const addColour = (links: WebLinks) => {
        return links.map((link) => Object.assign(link, {color: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#ededed66' : '#17171766'}))
    }

const ClientWeb = ({paths, links}: {paths: PathNode[], links: WebLinks}) => {
    const router = useRouter()
    const [isVisible, setIsVisible] = useState(true)
    const [graphLinks, setGraphLinks] = useState(addColour(links))
    useEffect(() => {
        if(window?.matchMedia){
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (_event) => {
                setGraphLinks(() => addColour(links))
            })
        }
    }, [links])

    useEffect(() => {
        const handleScroll = (_event: Event) => {
            if(window){
                const { scrollY } = window;
                console.log(scrollY)
                setIsVisible(scrollY <= screen.availHeight*0.5)
            }
        }

        document.addEventListener('scroll', handleScroll);

        return () => {
            document.removeEventListener('scroll', handleScroll);
        };
    }, []);
    if(paths.length > 0 && links.length > 0){
        if(isVisible){
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
        } else {
            return (
                <>
                    <div style={{height: Math.floor(screen.availHeight*0.5)}} />
                    <div className="fixed top-3 right-3">
                        <ForceGraph2D
                            graphData={{
                                nodes: paths,
                                links: graphLinks
                            }}
                            height={Math.floor(screen.availHeight*0.4)}
                            width={Math.floor(screen.availWidth*0.4)}
                            onNodeClick={(node, _event) => {
                                router.push(`/md/${node.id.split(ROOTNAME).at(-1)!}`)
                            }}
                        />
                    </div>
                </>
            )
        }
    }
}

export default ClientWeb
