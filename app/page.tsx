import Image from "next/image";
import Page from "./dashboard/page";

export const dynamic = "force-dynamic"
export default function Home() {
  return (<Page />);
}
