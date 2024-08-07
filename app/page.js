"use client";

import { useRouter } from "next/navigation";
import Swal from "sweetalert2";



export default function Home() {
  const router = useRouter();
  const handlePlay = () => {
    console.log("Handle Play Clicked"); // เพิ่มการดีบัก
    Swal.fire({
      title: "Do you want to play ?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#ff5757",
      confirmButtonText: "Yes",
    }).then((result) => {
      console.log("Swal Result:", result); // เพิ่มการดีบัก
      if (result.isConfirmed) {
        router.push("/play");
      }
    });
  };
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col">
        <div className="-topic w-screen py-12 h-full text-center mb-20">
          <h1 className="text-6xl text-white font-bold btn bg-transparent border-none hover:bg-transparent border-none">
            Hangman Game
          </h1>
        </div>
        <div className="-but-start flex justify-center">
          <button
            className="w-96 h-32 btn text-4xl border-none text-white rounded-box"
            onClick={handlePlay}
          >
            Start
          </button>
        </div>
      </div>
    </main>
  );
}
