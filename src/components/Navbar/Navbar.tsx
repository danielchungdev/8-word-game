import { FC } from "react"

interface NavbarProps {
    wrongs: number
}

export const Navbar: FC<NavbarProps> = ({ wrongs }) => {
    return (
        <div className="border-b-2 border-neutral-900 py-5 ">
            <p className="text-xl font-bold">TikTok 5 Word Game</p>
            <div className="text-sm">
                <p className="text-red-500">Wrong guesses: {wrongs}</p>
            </div>
        </div>
    )
}

