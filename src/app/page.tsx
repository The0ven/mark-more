import { DataPath } from "@/types/config";
import { DataPaths } from "@/data.config";
import Link from "next/link";
import { GenericWeb } from "./components/Web";
import { ROOTNAME } from "@/data.config.client";
import { path2Title } from "./utils/files";

const HomeLink = ({path}: {path: DataPath}) => {
    const url = encodeURI(path.split(ROOTNAME).at(-1)!)
    return (
        <Link href={`/md/${url}`.replaceAll('//','/')} className={`text-2xl font-serif font-thin tracking-tight ${!url && "text-red-200"}`}>
            {path2Title(path)}
        </Link>
    )
}

export async function HomeLinks({ path }: { path?: string }){
    const paths = await DataPaths(path)
    return (
        <div className="size-full border-t pt-6 px-24 flex flex-col">
            {paths.map((path) => <HomeLink path={path} key={path} />)}
        </div>
    )
}

const HomeWeb = async() => <GenericWeb paths={await DataPaths()}/>

export default function Home() {
  return (
        <div className="size-full flex flex-col">
            <HomeWeb />
            <HomeLinks />
        </div>
  );
}
