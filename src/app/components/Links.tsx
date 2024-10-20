import Link from "next/link";
import { ReactNode } from "react";
import { findPermaLink, path2Title } from "../utils/files";
import { ROOTNAME } from "@/data.config.client";
import { DataPaths } from "@/data.config";
import { DataPath } from "@/types/config";

export default async function CustomLink(props: { children?: ReactNode, className?: string, href?: string }) {
    if(!props.href){
        return <Link href=''>{props.children}</Link>
    } 
    const href = await findPermaLink(props.href)
    const url = encodeURI(href.split(ROOTNAME).at(-1)!)
    return href.startsWith('/') || href === '' ? (
        <Link href={`/md${url}`} className={props.className}>
            {props.children}
        </Link>
    ) : (
        <a
            className={props.className}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
        >
            {props.children}
        </a>
    );
}

const HomeLink = ({path}: {path: DataPath}) => {
    const url = path.split(ROOTNAME).at(-1)!
    return (
        <Link href={`/md/${url}`.replaceAll('//','/')} className={`text-2xl font-serif font-thin tracking-tight ${!url && "text-red-200"}`}>
            {path2Title(path)}
        </Link>
    )
}

export async function HomeLinks({ path }: { path?: string }){
    const paths = await DataPaths(path)
    return (
        <div className="size-full border-t pt-6 px-3 lg:px-24 flex flex-col">
            {paths.map((path) => <HomeLink path={path} key={path} />)}
        </div>
    )
}
