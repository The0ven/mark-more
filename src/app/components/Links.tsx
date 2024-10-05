import Link from "next/link";
import { ReactNode } from "react";
import { findPermaLink } from "../utils/files";
import { ROOTNAME } from "@/data.config.client";

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
