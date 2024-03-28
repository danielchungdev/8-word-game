"use client";
import { TileRow } from "@/components/TileRow";
import { useEffect, useMemo, useState } from "react";
import { useAnimation } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Keyboard } from "@/components/Keyboard";
import { Modal } from "@/components/Modal";
import { Instructions } from "@/components/Instructions";
import { Congratulations } from "@/components/Congratulations";
import { Footer } from "@/components/Footer/Footer";
import { WORDLIST } from "@/utils/wordlist";

interface History {
  date: string;
  tries: number;
}
interface Stats {
  totalTries: number;
  totalCompleted: number;
  history: History[];
  showTutorial: boolean;
  completedToday: boolean;
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
  const [correctState, setCorrectState] = useState<boolean[]>([
    true,
    false,
    false,
    false,
    false,
  ]);
  const [stats, setStats] = useState<Stats>({
    totalTries: 0,
    totalCompleted: 0,
    history: [],
    showTutorial: true,
    completedToday: false,
  });
  const [showInstructions, setShowInstructions] = useState<boolean>(
    stats.showTutorial,
  );
  const [showFinished, setShowFinished] = useState<boolean>(
    stats.completedToday,
  );
  const startDate = useMemo(() => {
    const date = new Date(2024, 2, 26);
    date.setUTCHours(0, 0, 0, 0);
    return date;
  }, []);

  const closeInstructions = () => {
    setShowInstructions(false);
  };

  const openInstructions = () => {
    setShowInstructions(true)
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

  const saveCurrentAttempt = () => {
    const currentAttempt = {
      date: new Date(),
      wordState: wordState,
      tries: tries,
      currentRow: currentRow,
      currentWordIndex: currentWordIndex,
      correctState: correctState,
    };

    localStorage.setItem(
      "word-association-current-attempt",
      JSON.stringify(currentAttempt),
    );
  };

  const loadSavedAttempt = () => {
    const savedAttempt = localStorage.getItem("word-association-current-attempt");
    if (savedAttempt) {
      const parsedAttempt = JSON.parse(savedAttempt);
      const savedDate = new Date(parsedAttempt.date);
      const today = new Date();
      if (
        savedDate.getUTCFullYear() === today.getUTCFullYear() &&
        savedDate.getUTCMonth() === today.getUTCMonth() &&
        savedDate.getUTCDate() === today.getUTCDate()
      ) {
        setWordState(parsedAttempt.wordState);
        setTries(parsedAttempt.tries);
        setCurrentRow(parsedAttempt.currentRow);
        setCurrentWordIndex(parsedAttempt.currentWordIndex);
        setCorrectState(parsedAttempt.correctState);
      } else {
        clearSavedAttempt();
      }
    }
  };

  const clearSavedAttempt = () => {
    console.log("cleaning localstore");
    localStorage.removeItem("word-association-current-attempt");
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
        saveCurrentAttempt();
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
          localStorage.setItem(
            "word-association-stats",
            JSON.stringify(updatedData),
          );
          setStats(updatedData);
          localStorage.removeItem("word-association-current-attempt");
          console.log("finished cleaning");
        }
      } else {
        // Incorrect submission
        tileRowControls[currentRow].start({
          x: [-4, 4, -4, 4, 0],
          transition: { duration: 0.5 },
        });
        setTries((tries) => tries + 1);
      }
    } else {
      saveCurrentAttempt();
    }
  };

  const handleKeyboardPress = (key: string) => {
    console.log("here");
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
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
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
  }, [
    currentRow,
    currentWordIndex,
    wordState,
    fillTile,
    clearTile,
    checkSubmission,
  ]);

  useEffect(() => {
    loadSavedAttempt(); // Load saved attempt on component mount
  }, []);

  useEffect(() => {
    //Load stats if exist
    let statsData: string | null = localStorage.getItem(
      "word-association-stats",
    );
    if (statsData) {
      let jsonStats = JSON.parse(statsData);
      const history = jsonStats.history;
      const lastDate = history[history.length - 1]?.date;
      setShowInstructions(false);
      setStats({
        ...jsonStats,
        showTutorial: false,
        completedToday: lastDate === formatDate(new Date()),
      });
    }
  }, [currentDay]);

  useEffect(() => {
    const checkTime = () => {
      const today = new Date();
      const timeDifference = today.getTime() - startDate.getTime();
      const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      setCurrentDay(daysDifference);
    };
    checkTime();

    const seconds = 60;
    setInterval(checkTime, seconds * 1000);
  }, [startDate]);

  useEffect(() => {
    setWords(WORDLIST[currentDay % WORDLIST.length]);
  }, [currentDay]);

  useEffect(() => {
    if (words && !localStorage.getItem("word-association-current-attempt")) {
      // if (words) {
      setWordState({
        0: words[0].split(""),
        1: [words[1][0], ...Array(words[1].length - 1).fill("")],
        2: [words[2][0], ...Array(words[2].length - 1).fill("")],
        3: [words[3][0], ...Array(words[3].length - 1).fill("")],
        4: [words[4][0], ...Array(words[4].length - 1).fill("")],
      });
      setCorrectState([true, false, false, false, false]);
    }
  }, [words]);

  useEffect(() => {
    if (stats.completedToday) {
      setWordState({
        0: words[0].split(""),
        1: words[1].split(""),
        2: words[2].split(""),
        3: words[3].split(""),
        4: words[4].split(""),
      });
      setCorrectState(new Array(5).fill(true));
      setShowFinished(true);
    }
  }, [stats]);

  const closeFinished = () => {
    setShowFinished(false)
  }

  return (
    <>
      <main>
        <div className="w-screen">
          <div className="w-11/12 m-auto grid place-content-center">
            <Navbar openInstructions={openInstructions}/>
            <div className="mx-auto my-8 flex flex-col gap-2">
              {Array.from({ length: 5 }, (_, index) => (
                <TileRow
                  key={index}
                  word={wordState[index]}
                  animate={tileRowControls[index]}
                  correct={correctState[index]}
                />
              ))}
            </div>
            <Keyboard onKeyPress={handleKeyboardPress} />
            {!showFinished && <Footer />}
          </div>
        </div>
        <Modal isOpen={showInstructions} onClose={closeInstructions}>
          <Instructions />
        </Modal>
        <Modal isOpen={showFinished} onClose={closeFinished} solidBackdrop={true}>
          <Congratulations
            todayTries={tries | 0}
            totalCompleted={stats.totalCompleted | 0}
          />
        </Modal>
      </main>
    </>
  );
}
