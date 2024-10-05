'use client'

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { relative2Absolute } from "../utils/files"

export const HomeButton = (props: {className: string}) => {
    const [imageSrc, setImageSrc] = useState("/closed.png")
    return(
        <Link href="/" className={props.className}>
            <Image 
                src={imageSrc} 
                width={512} 
                height={512} 
                alt="home" 
                className="dark:invert size-10" 
                onMouseEnter={
                    () => setImageSrc("/open.png")
                }
                onMouseLeave={
                    () => setImageSrc("/closed.png")
                }
            />
        </Link>
    )
}

const BreadCrumb = (props: { crumb: string, path: string }) => {
    return (
        <div className="flex items-center gap-x-3">
            <Link href={props.path} className="text-4xl opacity-90">{props.crumb}</Link>
            <h2 className="text-3xl text-neutral-600">/</h2>
        </div>
    )
}

export const BreadCrumbs = (props: { path: string, className: string }) => {
    const crumbs = props.path.split('/').slice(0, -1)
    return (
        <div className={props.className}>
            {crumbs.map((crumb, idx) => <BreadCrumb crumb={crumb} path={`/md/${crumbs.slice(0, idx+1).join('/')}`} />)}
        </div>
    )
}
