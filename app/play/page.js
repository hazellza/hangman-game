"use client";
import { useEffect, useState, useRef } from "react";
import "./style.css";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

export default function Page() {
  const error1 = () =>
    toast.error(`Sorry, you're wrong. Remaining ${mistakes}`, {
      position: "top-left",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    
    const error2 = () =>
      toast.error("You have already tried this character", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      theme: "dark",
    });
    
  const restart = () => {
    Swal.fire({
      title: "Game Over",
      text: "Do you want to play again?",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#ff5757",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        startGame(); // เรียกฟังก์ชันเริ่มเกมใหม่
      }
    });
  };
  
  const exit = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will exit this game!!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#ff5757",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        router.push("/");
      }
    });
  };
  
  const point = () => {
    toast.success("🔥 Exactly 🔥", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };
  
  const checkAllWordsUsed = () => {
    if (usedWords.length === words.length) {
      clearTimeout(timeoutRef.current);
      Swal.fire({
        title: "Congratulations!",
        text: "You've guessed all the words!",
        width: 600,
        padding: "3em",
        color: "#716add",
        background: "#fff url(/images/trees.png)",
        confirmButtonText: "OK",
        backdrop: `
        rgba(0,0,123,0.4)
        url("/images/nyan-cat.gif")
        left top
        no-repeat
        `,
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/");
        }
      });
    }
  };
  const words = ["ant", "bird", "cat", "cow", "dog"]; // array ที่มีคำต่างๆ
  const [selectedWord, setSelectedWord] = useState(""); // คำที่ถูกสุ่มมาเล่น
  const [guesses, setGuesses] = useState([]); // ตัวอักษรที่ผู้เล่นเดา
  const [mistakes, setMistakes] = useState(10); // จำนวนครั้งที่เดาผิด
  const [isGameOver, setIsGameOver] = useState(false); // สถานะของเกม
  const [usedWords, setUsedWords] = useState([]); // คำที่ถูกใช้ไปแล้ว
  const [scores, setScores] = useState(0); // คะแนนจากการตอบถูก
  const scoreUpdated = useRef(false); // Flag สำหรับการตรวจสอบการอัปเดตคะแนน
  const timeoutRef = useRef(null); // ใช้เก็บ timeout ID
  const router = useRouter(); // ประกาศค่าตัวแปร
  
  
  const startGame = (newScores = scores) => {
    // ยกเลิก timeout ที่ตั้งไว้ก่อนหน้านี้
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    let newWord;
    // ลูปสุ่มคำจนกว่าจะได้คำที่ยังไม่ถูกเลือก
    do {
      newWord = words[Math.floor(Math.random() * words.length)];
    } while (usedWords.includes(newWord));

    // ตั้งค่า state ใหม่เมื่อเริ่มเกม
    setSelectedWord(newWord);
    setUsedWords([...usedWords, newWord]);
    setGuesses([]);
    setMistakes(10);
    setIsGameOver(false);
    scoreUpdated.current = false; // Reset flag เมื่อเริ่มเกมใหม่

    // ใช้คะแนนใหม่ที่ส่งเข้ามาหรือคะแนนเดิม
    setScores(newScores);
  };

  useEffect(() => {
    startGame();
  }, []);

  useEffect(() => {
    if (mistakes === 0) {
      setIsGameOver(true);
      restart(); // เรียกฟังก์ชัน restart เมื่อจำนวนครั้งที่ผิดเหลือ 0
    } else if (
      selectedWord &&
      guesses.length > 0 &&
      selectedWord.split("").every((letter) => guesses.includes(letter)) &&
      !scoreUpdated.current // ตรวจสอบว่าไม่ได้อัปเดตคะแนนแล้วในรอบนี้
    ) {
      setIsGameOver(true);
      const newScores = scores + 1; // เพิ่มคะแนน
      setScores(newScores); // ส่งคะแนนใหม่ ไปในฟังก์ชัน setScores
      scoreUpdated.current = true; // รีเซ็ต flag คะแนน
      point();

      // เรียกฟังก์ชันเริ่มเกมใหม่พร้อมคะแนนที่อัปเดต
      timeoutRef.current = setTimeout(() => startGame(newScores), 2000); // ให้เวลา 2 วินาที ก่อนเริ่มเกมใหม่
    }
  }, [guesses, mistakes, scores, selectedWord]);

  useEffect(() => {
    if (isGameOver) {
      checkAllWordsUsed(); // ตรวจสอบทุกคำที่ถูกใช้แล้วหลังจากเกมจบ
    }
  }, [isGameOver, usedWords]);

  const handleGuess = (letter) => {
    if (isGameOver) {
      return; // หากเกมจบแล้วไม่ให้ทำอะไร
    }

    if (guesses.includes(letter)) {
      error2(); // แจ้งเตือนอักษรถูกเดาไปแล้ว
      return; // หากอักษรถูกเดาไปแล้ว, หยุดการทำงานของฟังก์ชัน
    }

    if (selectedWord.includes(letter)) {
      setGuesses([...guesses, letter]);

      // ตรวจสอบว่าคำทั้งหมดถูกเดาถูกต้องแล้วหรือไม่
      if (selectedWord.split("").every((letter) => guesses.includes(letter))) {
        setIsGameOver(true);
        const newScores = scores + 1; // เพิ่มคะแนน
        setScores(newScores); // ส่งคะแนนใหม่ ไปในฟังก์ชัน setScores
        scoreUpdated.current = true; // รีเซ็ต flag คะแนน

        // เรียกฟังก์ชันเริ่มเกมใหม่พร้อมคะแนนที่อัปเดต
        timeoutRef.current = setTimeout(() => startGame(newScores), 2000); // ให้เวลา 2 วินาที ก่อนเริ่มเกมใหม่
      }
    } else {
      setMistakes(mistakes - 1); // เพิ่มจำนวนครั้งที่ผิด
      error1(); // แสดงการแจ้งเตือน
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center">
      <header className="-header flex justify-between items-center px-6 py-2 bg-red-400 mt-2 h-20 rounded-box w-3/5">
        <div className="-score flex items-center">
          <span className="text-black font-bold text-2xl">
            SCORE : {scores}
          </span>
        </div>
        <div className="-exit">
          <button className="-but-exit btn w-28" onClick={exit}>
            EXIT
          </button>
        </div>
      </header>
      <div className="-content mt-5">
        {selectedWord.split("").map((letter, index) => (
          <span key={index} className="px-4 text-white text-6xl">
            {guesses.includes(letter) ? letter : "_"}
          </span>
        ))}
      </div>
      <div className="-con-character border-2 rounded-box px-2 py-4 mt-2">
        <ul className="-list-character grid grid-cols-8 gap-2">
          {[
            "A",
            "B",
            "C",
            "D",
            "E",
            "F",
            "G",
            "H",
            "I",
            "J",
            "K",
            "L",
            "M",
            "N",
            "O",
            "P",
            "Q",
            "R",
            "S",
            "T",
            "U",
            "V",
            "W",
            "X",
            "Y",
            "Z",
          ].map((letter) => (
            <li key={letter}>
              <button
                onClick={() => handleGuess(letter.toLowerCase())}
                className="-character"
              >
                {letter}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <ToastContainer />
    </div>
  );
}
