import { BreadCrumbs, HomeButton } from "@/app/components/Header";
import CustomLink from "@/app/components/Links";
import { HomeLinks } from "@/app/page";
import { path2Title, relative2Absolute } from "@/app/utils/files";
import { BACKENDHOST, DataPaths } from "@/data.config";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import rehypeReact from "rehype-react";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import wikiLinkPlugin from "remark-wiki-link";
import { unified } from "unified";
import * as motion from "framer-motion/client"

const getBody = async(fileName: string) => {
    console.log("starting getBody")
    const time = Date.now()
    const data = await (await fetch(`${BACKENDHOST}/read/${relative2Absolute(fileName)}`)).text()
    const body = await unified()
        .use(remarkParse, {gfm: true})
        .use(wikiLinkPlugin, {
            aliasDivider: '|',
            permalinks: (await DataPaths()).map(path2Title),
            wikiLinkClassName: 'text-accent',
            newClassName: 'text-secondary',
            pageResolver: (name: string) => [name],
            hrefTemplate: (permaLink: string) => permaLink,
        })
        .use(remarkRehype)
        // @ts-expect-error: the react types are missing.
        .use(rehypeReact, {
            Fragment: Fragment,
            jsx: jsx,
            jsxs: jsxs,
            components: {
                a: CustomLink
            }
        })
        .process(data)
    console.log(`getting body took ${(Date.now() - time)}ms`)
    return body.result
}

const ArticleHeader = ({titlePath}: {titlePath: string}) => {
    const list = {
        visible: { 
            transition: {
                layout: {duration: 0.2, ease: "linear"},
                when: "beforeChildren",
                staggerChildren: 0.2,
                staggerDirection: -1
            } 
        },
        hidden: { 
            transition: {
                when: "afterChildren",
            }
        }
    }
    const item = {
        visible: { opacity: 1 },
        hidden: { opacity: 0 },
    }
    const title = {
        visible: { opacity: 1 },
        hidden: { opacity: 1 }
    }
    return(
        <motion.div
            initial="hidden"
            whileHover="visible"
            layout
            layoutRoot
            variants={list}
            className="group flex items-center gap-x-3"
        >
            <motion.div variants={item} className="hidden group-hover:block">
                <HomeButton className="hidden group-hover:block opacity-80"/>
            </motion.div>
            <motion.div variants={item} className="hidden group-hover:block">
                <BreadCrumbs path={titlePath} className="hidden group-hover:block" />
            </motion.div>
            <motion.h1 layout className="text-5xl" variants={title}>{path2Title(titlePath)}</motion.h1>
        </motion.div>
    )
}

async function Article({ file }: { file: string }){
    const body = await getBody(file)
    return(
        <article className="prose prose-neutral dark:prose-invert prose-lg max-w-[50%]">
            {body}
        </article>
    )
}

export default async function FileRouter({ params }: { params: { path: string[] } }){
    const file = decodeURI(params.path.join('/'))
    return(
        <div className="font-serif font-thin py-6 pl-36 w-full">
            <ArticleHeader titlePath={file} />
            {
                params.path.at(-1)!.endsWith('.md')
                    ? <Article file={file} />
                    : <HomeLinks path={`/${params.path.join('/')}/`}/>
            }
        </div>
    )
}
