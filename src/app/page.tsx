import GameSetup from "@/components/GameSetup";

export default function Home() {
  return <GameSetup />;
}

// // import GameSetup from "@/components/GameSetup";
// // export const dynamic = "force-dynamic";
// import dynamic from "next/dynamic";

// const DynamicComponent = dynamic(() => import("@/components/GameSetup"), {
//   ssr: false,
// });

// export default function Home() {
//   return <DynamicComponent />;
// }
