"use client"
import { FC } from "react"

interface Tile {
    letter: string | null,
    correct: boolean
}

export const Tile: FC<Tile> = ({ letter, correct }) => {
    return (
        <div className={`w-14 h-14 grid place-content-center border-2 ${ correct ? "border-green-500" : "border-neutral-900"}`}>
            <p className={`text-center text-2xl font-bold ${correct ? "text-green-500" : "text-neutral-900"}`}>{letter?.toUpperCase()}</p>
        </div>
    )
}