// VirtualKeyboard.tsx
import { FC } from "react";
import Image from "next/image";

interface Keyboard {
    onKeyPress: (key: string) => void;
}

export const Keyboard: FC<Keyboard> = ({ onKeyPress }) => {
    const rows = [
        ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
        ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
        ["ENTER", "z", "x", "c", "v", "b", "n", "m", "<"],
    ];

    const renderKey = (key: string) => {
        if (key === "ENTER") {
            return (
                <button
                    key={key}
                    onClick={() => onKeyPress("Enter")}
                    className={`h-14 w-[49px] xs:w-14 bg-neutral-200 rounded text-xs font-bold`}
                >
                    {key}
                </button>
            )
        }
        else if (key === "<") {
            return (
                <button
                    key={"Backspace"}
                    onClick={() => onKeyPress("Backspace")}
                    className={`h-14 w-[49px] xs:w-14 bg-neutral-200 rounded font-bold`}
                >
                    <Image className="m-auto" width={24} height={24} src={"/icons/backspace.svg"} alt="backspace" />
                </button>
            )
        }
        else {
            return (
                <button
                    key={key}
                    onClick={() => onKeyPress(key.toLowerCase())}
                    className="h-14 w-[1.9rem] xs:w-9 bg-neutral-200 rounded font-bold"
                >
                    {key.toUpperCase()}
                </button>
            )
        }
    }

    return (
        <div className="grid place-content-center gap-[0.3rem] m-auto">
            {rows.map((row, rowIndex) => (
                <div key={rowIndex} className={`flex gap-[0.3rem] ${rowIndex < 2 ? "m-auto" : ""}`}>
                    {row.map((key) => (
                        renderKey(key)
                    ))}
                </div>
            ))}
        </div>
    );
};
