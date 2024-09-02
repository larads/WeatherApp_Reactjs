import { IoMdSearch } from 'react-icons/io'
import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { }

export function Button({ ...props }: ButtonProps) {
    return (
        <button
            className='bg-blue-950 hover:bg-blue-950/5 w-16 h-10 rounded-full flex justify-center items-center transition'
            {...props}>

            <IoMdSearch
                className='text-2xl text-white'
            />

        </button>
    )
}