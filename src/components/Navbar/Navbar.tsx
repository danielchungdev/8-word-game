import { FC } from "react"

interface NavBarProps{
    openInstructions: () => void;
}

export const Navbar: FC<NavBarProps> = ({ openInstructions }) => {
    return (
        <div className="border-b-2 border-neutral-900 py-4 mx-2">
            <div className="custom-grid">
                <div></div>
                <p className="text-2xl font-bold text-center">Word Association</p>
                <p tabIndex={0} onClick={openInstructions} className="mt-[10px] inline-block hover:cursor-pointer my-auto hover:text-neutral-500">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
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
                </p>
            </div>
        </div>
    )
}

