import { TSettingsFields } from '@pages/settings/types'
import React from 'react'
import { FiEdit2 } from 'react-icons/fi'
import styled from 'styled-components'

const TextFieldStyled = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    cursor: pointer;
    padding: 0px 12px;
    min-height: 45px;
    border-radius: var(--brLight);

    &:hover {
        background: var(--theme-4);
    }

    .icon {
        width: 22px;
        height: 22px;
        margin-right: 10px;
        display: flex;
        justify-content: center;
        align-items: center;

        svg {
            width: 22px;
            height: 22px;
            opacity: 0.4;
        }
    }

    span {
        opacity: 0.8;
    }
`

const TextFieldStyledInfo = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;

    b {
        opacity: 0.8;
        font-weight: 500;
        font-size: 0.85rem;
    }

    span {
        opacity: 0.6;
        font-size: 0.8rem;
        margin-top: 2px;
    }
`

type FieldProps = Omit<TSettingsFields, 'type'> & {
    onClick?: () => void
    rightIcon?: React.ReactNode
    editable?: boolean
}

const TextFieldItem = ({ title, description, onClick, icon, rightIcon, editable = true }: FieldProps) => {
    return (
        <TextFieldStyled onClick={onClick}>
            {icon && <div className="icon">{icon}</div>}
            <TextFieldStyledInfo>
                <b>{title}</b>
                <span>{description}</span>
            </TextFieldStyledInfo>
            {rightIcon ?? (!editable ? null : <FiEdit2 />)}
        </TextFieldStyled>
    )
}

export default TextFieldItem
