import Notification from '@ui/notification'
import getLettersColors from '@utils/get-letters-colors'
import getNameFirstLetters from '@utils/get-name-first-letters'
import React, { useState } from 'react'
import { Container, Img } from '../atoms/avatar'

export default Avatar

interface Props {
    avatar?: string
    name: string
    width?: string
    height?: string
    marginRight?: string
    notifications?: number
    selected?: boolean
}

function Avatar({ selected, name, avatar, width, height, marginRight, notifications }: Props) {
    const [isLoaded, setIsLoaded] = useState<boolean>(true)
    const shortName = getNameFirstLetters(name)[0] + (getNameFirstLetters(name)[1] ?? '')

    return (
        <Container
            selected={selected}
            width={width}
            height={height}
            marginRight={marginRight}
            background={getLettersColors(name)}
        >
            {avatar && isLoaded ? (
                <Img onLoadedData={() => setIsLoaded(true)} onError={() => setIsLoaded(false)} src={avatar} />
            ) : (
                <div className="name">{shortName}</div>
            )}
            <Notification
                left="auto"
                right="-2px"
                top="90%"
                outline="5px solid var(--schedule)"
                visible={!!notifications}
            >
                {notifications}
            </Notification>
        </Container>
    )
}
