import Link from "next/link"
import { TileRow } from "../TileRow"
import { Footer } from "@/components/Footer"

export const Instructions = () => {
    return (
        <>
            <p className="text-xl font-bold">How To Play</p>
            <ul className="list-disc ml-4 text-sm mt-4">
                <li className="mt-1">Associate the current word with (only) the previous word.</li>
                <li className="mt-1">The association could be a <Link className="decoration-sky-500 text-sky-500 underline hover:decoration-sky-600 hover:text-sky-600" target="_blank" href={"https://www.grammarly.com/blog/open-and-closed-compound-words/"}>compound word</Link> (open, hyphenated or closed) or a popular phrase (almond milk).</li>
                <li className="mt-1">Your attempts will be counted!</li>
            </ul>
            <p className="mt-4 font-bold">Example</p>
            <div className="mt-2">
                <TileRow word={["o", "u", "t"]} correct={true} size={"small"} />
            </div>
            <p className="text-sm mt-2">After seeing the first word, 2 words come to mind: out<b>side</b> and out<b>door</b>.</p>
            <div className="mt-3">
                <TileRow word={["s", "", "", ""]} correct={false} size={"small"} />
            </div>
            <p className="text-sm mt-2">Because the next word starts with an <b>S</b>, lets give outside a try.</p>
            <div className="mt-3">
                <TileRow word={["o", "u", "t"]} correct={true} size={"small"} />
            </div>
            <div className="mt-2">
                <TileRow word={["s", "i", "d", "e"]} correct={true} size={"small"} />
            </div>
            <p className="text-sm mt-2">Continue this process until you have completed all words, good luck and have fun!</p>
            <Footer creds={true}/>
        </>
    )
}