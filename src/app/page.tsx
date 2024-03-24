"use client";
import { TileRow } from "@/components/TileRow";
import { useEffect, useState } from "react";
import { useAnimation } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Keyboard } from "@/components/Keyboard";

interface History{
  date: string,
  tries: number
}
interface Stats{
  totalTries: number,
  totalCompleted: number,
  history: History[],
  completedToday: boolean,
}

export default function Home() {
  const [tries, setTries] = useState<number>(0);
  const [words] = useState<string[]>(["out", "side", "profile", "picture", "perfect"]);
  const [currentRow, setCurrentRow] = useState<number>(1);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(1);
  const [wordState, setWordState] = useState<any>({
    0: words[0].split(""),
    1: [words[1][0], ...Array(words[1].length - 1).fill("")],
    2: [words[2][0], ...Array(words[2].length - 1).fill("")],
    3: [words[3][0], ...Array(words[3].length - 1).fill("")],
    4: [words[4][0], ...Array(words[4].length - 1).fill("")],
  });
  const [correctState, setCorrectState] = useState<boolean[]>([true, false, false, false, false])

  const [stats, setStats] = useState<Stats>({
    totalTries: 0,
    totalCompleted: 0,
    history: [],
    completedToday: false
  })

  const tileRowControls = [
    useAnimation(),
    useAnimation(),
    useAnimation(),
    useAnimation(),
    useAnimation(),
  ];

  const fillTile = (letter: string) => {
    let currentWordArray = wordState[currentRow];
    if (currentWordIndex < words[currentRow].length) {
      if (currentWordArray[currentWordIndex] === "") {
        currentWordArray[currentWordIndex] = letter;
        setWordState({
          ...wordState,
          currentRow: currentWordArray,
        });
      }
      setCurrentWordIndex(currentWordIndex + 1);
    }
  };

  const clearTile = (index: number) => {
    let currentWordArray = wordState[currentRow];
    let deleteAt = index - 1;
    if (deleteAt !== 0) {
      currentWordArray[deleteAt] = "";
      setWordState({
        ...wordState,
        currentRow: currentWordArray,
      });
      setCurrentWordIndex(currentWordIndex - 1);
    }
  };

  const checkSubmission = () => {
    let currentWord: string = wordState[currentRow].join("").toLowerCase();
    let matchword: string = words[currentRow].toLowerCase();
    if (currentWord.length === matchword.length) {
      if (currentWord === matchword) {
        //Correct submission
        setWordState({
          ...wordState,
          currentRow: currentWord.split(""),
        });
        setCurrentRow(currentRow + 1);
        setCurrentWordIndex(1);
        let correct = correctState;
        correct[currentRow] = true;
        setCorrectState(correct);
        if (currentRow === 4) {
          //Game finished successfully
          console.log("congratulations!");
          const newHistory = [
            ...stats.history,
            {
              date: formatDate(new Date()),
              tries: tries,
            },
          ];
          localStorage.setItem('word-association-stats', JSON.stringify({
            totalTries: stats.totalTries + tries,
            totalCompleted: stats.totalCompleted + 1,
            history: newHistory,
            completedToday: true,
          }));
        }
      } else {
        //Incorrect submission
        tileRowControls[currentRow].start({
          x: [-4, 4, -4, 4, 0],
          transition: { duration: 0.5 },
        });
        setTries(tries + 1);
      }
    }
  };

  const handleKeyboardPress = (key: string) => {
    if (isLetter(key)) {
      fillTile(key);
    }

    if (key === "Backspace") {
      clearTile(currentWordIndex);
    }

    if (key === "Enter") {
      checkSubmission();
    }
  };

  const handleKeyPress = (event: any) => {
    let keyPressed: string = event.key;
    if (currentRow < 5) {
      if (isLetter(keyPressed)) {
        fillTile(keyPressed);
      }

      if (event.key === "Backspace") {
        clearTile(currentWordIndex);
      }

      if (event.key === "Enter") {
        checkSubmission();
      }
    }
  };
  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const isLetter = (str: string) => {
    return str.length === 1 && str.match(/[a-z]/i);
  };

  useEffect(() => {
    
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [currentRow, currentWordIndex, wordState]);

  useEffect(() => {
    //Load stats if exist
    let statsData: string | null = localStorage.getItem('word-association-stats');
    if (statsData) {
      let jsonStats = JSON.parse(statsData);
      const history = jsonStats.history
      const lastDate = history[history.length - 1].date
      setStats({
        ...jsonStats,
        completedToday: lastDate === formatDate(new Date()),
      });
    }
  }, []);

  return (
    <>
      <main className="grid place-content-center mt-4">
        <Navbar wrongs={tries}/>
        <div className="flex flex-col gap-2 my-8">
          {Array.from({ length: 5 }, (_, index) =>
            <TileRow key={index} word={wordState[index]} animate={tileRowControls[index]} correct={correctState[index]} />
          )}
        </div>
        {/* TODO: add a modal for instructions and congratulations */}
        {/* {stats.completedToday ? <p>Completed today</p> : <p>you need to complete today</p>} */}
        <Keyboard onKeyPress={handleKeyboardPress} />
      </main>
    </>
  );
}
