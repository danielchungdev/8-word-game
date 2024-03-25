"use client";
import { TileRow } from "@/components/TileRow";
import { useEffect, useState } from "react";
import { useAnimation } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Keyboard } from "@/components/Keyboard";
import { Modal } from "@/components/Modal";
import { Instructions } from "@/components/Instructions";
import { StatsPage } from "@/components/StatsPage";
import { Footer } from "@/components/Footer/Footer";
import { WORDLIST } from "@/utils/wordlist";

interface History {
  date: string,
  tries: number
}
interface Stats {
  totalTries: number,
  totalCompleted: number,
  history: History[],
  showTutorial: boolean,
  completedToday: boolean,
}

//TODO: Move code logic to separate hooks to shrink this file down.
export default function Home() {
  const [tries, setTries] = useState<number>(0);
  const [currentDay, setCurrentDay] = useState<number>(0);
  const [words, setWords] = useState<string[]>(WORDLIST[currentDay]);
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
    showTutorial: true,
    completedToday: false
  })
  const [showInstructions, setShowInstructions] = useState<boolean>(stats.showTutorial)
  const [showFinished, setShowFinished] = useState<boolean>(stats.completedToday)

  const closeInstructions = () => {
    setShowInstructions(false)
  }

  const tileRowControls = [
    useAnimation(),
    useAnimation(),
    useAnimation(),
    useAnimation(),
    useAnimation(),
  ];

  const fillTile = (letter: string) => {
    let currentWordArray = [...wordState[currentRow]];
    if (currentWordIndex < words[currentRow].length) {
      if (currentWordArray[currentWordIndex] === "") {
        currentWordArray[currentWordIndex] = letter;
        setWordState({
          ...wordState,
          [currentRow]: currentWordArray,
        });
      }
      setCurrentWordIndex((currentWordIndex) => currentWordIndex + 1);
    }
  };

  const clearTile = (index: number) => {
    let currentWordArray = [...wordState[currentRow]];
    let deleteAt = index - 1;
    if (deleteAt !== 0) {
      currentWordArray[deleteAt] = "";
      setWordState({
        ...wordState,
        [currentRow]: currentWordArray,
      });
      setCurrentWordIndex((currentWordIndex) => currentWordIndex - 1);
    }
  };

  //TODO: Need to refactor this function. It seems that it's not allowing to check the same submission twice
  //TODO: Something to do with async of javascript. So duplicate submissions of the same wrong word will increase
  //TODO: the count of wrong tries. While this is undesireable.
  //TODO: Would also affect if we want to add something like a word bank.
  const checkSubmission = () => {
    let currentWord: string = wordState[currentRow].join("").toLowerCase();
    let matchword: string = words[currentRow].toLowerCase();

    if (currentWord.length === matchword.length) {
      if (currentWord === matchword) {
        // Correct submission
        setWordState({
          ...wordState,
          [currentRow]: currentWord.split(""),
        });
        setCurrentRow((currentRow) => currentRow + 1);
        setCurrentWordIndex(1);
        let correct = [...correctState];
        correct[currentRow] = true;
        setCorrectState(correct);
        if (currentRow === 4) {
          // Game finished successfully
          setShowFinished(true);
          const newHistory = [
            ...stats.history,
            {
              date: formatDate(new Date()),
              tries: tries,
            },
          ];
          const updatedData = {
            totalTries: stats.totalTries + tries,
            totalCompleted: stats.totalCompleted + 1,
            history: newHistory,
            showTutorial: false,
            completedToday: true,
          };
          localStorage.setItem('word-association-stats', JSON.stringify(updatedData));
          setStats(updatedData);
        }
      } else {
        // Incorrect submission
        tileRowControls[currentRow].start({
          x: [-4, 4, -4, 4, 0],
          transition: { duration: 0.5 },
        });
        setTries((tries) => tries + 1);
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

  const formatDate = (date: Date) => {
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${month}/${day}/${year}`;
  };

  const isLetter = (str: string) => {
    return str.length === 1 && str.match(/[a-z]/i);
  };

  useEffect(() => {
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
      const history = jsonStats.history;
      const lastDate = history[history.length - 1]?.date;
      setShowInstructions(false)
      setStats({
        ...jsonStats,
        showTutorial: false,
        completedToday: lastDate === formatDate(new Date()),
      });
    }
  }, []);

  useEffect(() => {
    const checkCurrentHour = () => {
      const currentTime = new Date().toUTCString();
      const currentHour = new Date(currentTime).getUTCHours();

      if (currentHour === 0) {
        console.log("It's 12:00 AM UTC");
        setCurrentDay((currentDay) => currentDay + 1)
      }
    };

    const currentTime = new Date();
    const timeToNextDay = new Date(
      currentTime.getUTCFullYear(),
      currentTime.getUTCMonth(),
      currentTime.getUTCDate() + 1,
      0, 0, 0, 0
    ).getTime() - currentTime.getTime();

    const intervalId = setInterval(checkCurrentHour, timeToNextDay);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    //TODO: CURRENTLY ARE LIMITED IT DOES FOLLOW ORDER.
    //TODO: WILL NEED TO END UP ADDING MORE WORDLISTS.
    setWords(WORDLIST[currentDay % WORDLIST.length]);
  }, [currentDay]);

  useEffect(() => {
    if (words) {
      setWordState({
        0: words[0].split(""),
        1: [words[1][0], ...Array(words[1].length - 1).fill("")],
        2: [words[2][0], ...Array(words[2].length - 1).fill("")],
        3: [words[3][0], ...Array(words[3].length - 1).fill("")],
        4: [words[4][0], ...Array(words[4].length - 1).fill("")],
      })
      setCorrectState([true, false, false, false, false])
    }
  }, [words])

  useEffect(() => {
    if (stats.completedToday) {
      setWordState({
        0: words[0].split(""),
        1: words[1].split(""),
        2: words[2].split(""),
        3: words[3].split(""),
        4: words[4].split(""),
      })
      setCorrectState(new Array(5).fill(true))
      setShowFinished(true)
    }
  }, [stats])

  return (
    <>
      <main className="grid place-content-center mt-4">
        <Navbar />
        <div className="flex flex-col gap-2 my-8 mx-auto">
          {Array.from({ length: 5 }, (_, index) =>
            <TileRow key={index} word={wordState[index]} animate={tileRowControls[index]} correct={correctState[index]} />
          )}
        </div>
        <Keyboard onKeyPress={handleKeyboardPress} />
        <Footer />
        <Modal isOpen={showInstructions} onClose={closeInstructions}>
          <Instructions />
        </Modal>
        <Modal isOpen={showFinished} onClose={() => { }} unclosable={true}>
          <StatsPage todayTries={tries | 0} totalTries={stats.totalTries | 0} totalCompleted={stats.totalCompleted | 0} />
        </Modal>
      </main>
    </>
  );
}