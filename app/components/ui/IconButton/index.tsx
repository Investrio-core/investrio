import React from "react";
import EditIcon from '@/public/icons/edit.svg'
import { twMerge } from 'tailwind-merge'
import './styles.css'

type CardProps = {
    className?: string,
    hoverClassName?: string,
    onClick?: () => void,
    Icon: React.ComponentType
  };

const IconButton = ({
    className,
    onClick,
    Icon
}: CardProps) => {

    return (
        <button className={twMerge(className, 'iconButton')} onClick={onClick} >
            <Icon />
        </button>
    )
}

export default IconButton