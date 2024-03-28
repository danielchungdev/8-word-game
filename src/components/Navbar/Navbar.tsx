import { FC } from "react"

interface NavBarProps{
    openInstructions: () => void;
}

export const Navbar: FC<NavBarProps> = ({ openInstructions }) => {
    return (
        <div className="border-b-2 border-neutral-900 py-4">
            <div className="flex justify-between">
                <div></div>
                <p className="text-2xl font-bold">Word Association</p>
                <div tabIndex={0} onClick={openInstructions} className="hover:cursor-pointer my-auto hover:text-neutral-500">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                </div>
            </div>
        </div>
    )
}

