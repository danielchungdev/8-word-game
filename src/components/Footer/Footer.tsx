import { FC } from "react"
import Link from "next/link"

interface FooterProps{
    creds?: boolean
}

export const Footer: FC<FooterProps> = ({ creds = false }) => {
    return (
        <>
            <hr className="h-px my-4 w-48 mx-auto bg-gray-200 border-0" />
            <div className="text-center">
                <p className="text-xs">Built by <Link target="_blank" href="https://github.com/danielchungdev" className="text-orange-500 hover:text-orange-600 underline">Daniel Chung</Link></p>
                {creds && <p className="text-xs mt-1">Inspired by jasminandjulio</p>}
            </div>
        </>
    )
}