"use client";
import LockScreen from "@/components/LockScreen";
import { useState } from "react";
import Desktop from "@/components/Desktop";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({ weight: "400", subsets: ["latin"] });

export default function Home() {
  const [isUnlocked, setIsUnlocked] = useState(true);
  return (
    <div className={orbitron.className}>
      {isUnlocked ? <Desktop /> : <LockScreen setUnlocked={setIsUnlocked} />}
    </div>
  );
}
