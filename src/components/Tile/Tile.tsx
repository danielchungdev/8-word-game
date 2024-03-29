"use client"
import { FC } from "react"

interface TileProps {
    letter: string | null,
    correct: boolean,
    size: "small" | "normal"
}

export const Tile: FC<TileProps> = ({ letter, correct, size }) => {
    return (
        <div className={`${size === "normal" ? "w-11 h-11" : "w-6 h-6"} grid place-content-center border-2 ${ correct ? "border-green-500" : "border-neutral-900"}`}>
            <p className={`${size === "normal" ? "text-2xl" : "text-sm"} text-center font-bold ${correct ? "text-green-500" : "text-neutral-900"}`}>{letter?.toUpperCase()}</p>
        </div>
    )
}