import { DataPath } from "@/types/config";
import { DataPaths } from "@/data.config";
import Link from "next/link";
import { GenericWeb } from "./components/Web";

const HomeLink = ({path}: {path: DataPath}) => {
    return (
        <Link href={path} className="text-xl">
            {path.split("/").at(-1)?.slice(0, -3)}
        </Link>
    )
}

const HomeLinks = async() => (await DataPaths()).map((path) => <HomeLink path={path} key={path} />)

const HomeWeb = async() => <GenericWeb paths={await DataPaths()}/>

export default function Home() {
  return (
        <div className="size-full flex flex-col">
            <HomeWeb />
            <HomeLinks/>
        </div>
  );
}
