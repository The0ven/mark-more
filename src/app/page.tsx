import { DataPaths } from "@/data.config";
import { GenericWeb } from "./components/Web";
import { HomeLinks } from "./components/Links";

const HomeWeb = async() => <GenericWeb paths={await DataPaths()}/>

export default function Home() {
  return (
        <div className="size-full flex flex-col">
            <HomeWeb />
            <HomeLinks />
        </div>
  );
}
