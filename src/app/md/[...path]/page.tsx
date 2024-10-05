import { BreadCrumbs, HomeButton } from "@/app/components/Header";
import { HomeLinks } from "@/app/page";
import { path2Title, relative2Absolute } from "@/app/utils/files";
import { DataPaths } from "@/data.config";
import { readFile } from "fs/promises";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import rehypeReact from "rehype-react";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import wikiLinkPlugin from "remark-wiki-link";
import { unified } from "unified";

const getBody = async(fileName: string) => {
    const data = await readFile(relative2Absolute(fileName), 'utf8')
    const body = await unified()
        .use(remarkParse, {gfm: true})
        .use(wikiLinkPlugin, {
            aliasDivider: '|',
            permalinks: await DataPaths(),
            pageResolver: (name: string) => [name],
            hrefTemplate: (permaLink: string) => `/md/${permaLink}.md`
        })
        .use(remarkRehype)
        // @ts-expect-error: the react types are missing.
        .use(rehypeReact, {
            Fragment: Fragment,
            jsx: jsx,
            jsxs: jsxs
        })
        .process(data)
    return body.result
}

const ArticleHeader = ({titlePath}: {titlePath: string}) => {
    return(
        <div className="group flex items-center gap-x-3">
            <HomeButton className="hidden group-hover:block opacity-80"/>
            <BreadCrumbs path={titlePath} className="hidden group-hover:block" />
            <h1 className="text-5xl">{path2Title(titlePath)}</h1>
        </div>
    )
}

async function Article({ file }: { file: string }){
    const body = await getBody(file)
    return(
        <article className="prose prose-neutral dark:prose-invert">
            {body}
        </article>
    )
}

export default async function FileRouter({ params }: { params: { path: string[] } }){
    const file = decodeURI(params.path.join('/'))
    return(
        <div className="font-serif font-thin py-6 px-20">
            <ArticleHeader titlePath={file} />
            {
                params.path.at(-1)!.endsWith('.md')
                    ? <Article file={file} />
                    : <HomeLinks path={`/${params.path.join('/')}/`}/>
            }
        </div>
    )
}
