"use client"

import { useRouter } from "next/navigation";
import UserLayout from "./layout/userLayout/page";


export default function Home() {

  const router = useRouter()

  return (
    <UserLayout>
      <div className="h-screen w-screen">
        <div className="main-container flex justify-center items-center">
          <div className="main-container-left">
            <p className="mb-2">Connect with friends without exaggeration</p>
            <p className="mb-2">
              A true social media platform with only stories and no bluffs
            </p>
            <button
              className="join-btn cursor-pointer border-2 rounded-xl px-2 py-1 mt-2"
              onClick={() => router.push("/signin")}
            >
              Join now!
            </button>
          </div>
          <div className="main-container-right">
            <img className="max-h-96" src="/images/connect2.png" alt="image" />
          </div>  
        </div>
      </div>
    </UserLayout>
  );
}
