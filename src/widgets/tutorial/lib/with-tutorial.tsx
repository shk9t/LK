import React, { ComponentType, useCallback, useState } from 'react'
import ReactDOM from 'react-dom'
import { useUnit } from 'effector-react'
import styled, { keyframes } from 'styled-components'
import { FaArrowLeftLong, FaArrowRightLong, FaCheck } from 'react-icons/fa6'
import { Title } from '@shared/ui/title'
import Flex from '@shared/ui/flex'
import { tutorialModel } from '@entities/tutorial'
import { SkipButton } from '../ui/skip-button'
import useResize from '@shared/lib/hooks/use-resize'
import { TutorialId } from '@entities/tutorial/types'

type HintPosition = 'right' | 'bottom' | 'top' | 'left'
type Dimensions = { width: number; height: number }
type Position = { top: number; left: number; right: number; bottom: number }
export interface TutorialWrapperProps {
    tutorialModule?: {
        id: TutorialId
        step: number | number[]
        params?: {
            noPadding?: boolean
            position?: HintPosition

            // TODO: implement
            inside?: boolean
            widthMatchParent?: boolean
            heighyMatchParent?: boolean
        }
    }
}

export type TutorialComponent = {
    forwardedRef?: (node: HTMLElement | null) => void
}

// eslint-disable-next-line @typescript-eslint/ban-types
const debounce = (fn: Function, ms = 300) => {
    let timeoutId: ReturnType<typeof setTimeout>
    return function (this: any, ...args: any[]) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => fn.apply(this, args), ms)
    }
}

export const withTutorial = <P,>(WrappedComponent: ComponentType<P & TutorialComponent>) => {
    const TutWrapper: React.FC<P & TutorialWrapperProps> = (props) => {
        const { width } = useResize()
        const [animation, setAnimation] = useState<'in' | 'out' | 'removed'>('in')
        const [clickCounter, setClickCounter] = useState(0)
        const portal = document.getElementById('portal')
        const root = document.getElementById('root')
        const [visible, setVisible] = useState(false)

        const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 })
        const [position, setPosition] = useState<Position | null>(null)
        const handleRef = useCallback((node: HTMLElement | null) => {
            if (!node || !root) return
            const measureDOMNode = () => {
                const rect = node.getBoundingClientRect()
                setDimensions({ width: rect.width, height: rect.height })
                setPosition({ top: rect.top, left: rect.left, right: rect.right, bottom: rect.bottom })
            }
            const debouncedUpdate = debounce(measureDOMNode)
            measureDOMNode()

            const intersectionObserver = new IntersectionObserver(([entry]) => {
                setVisible(entry.isIntersecting)
                if (entry.isIntersecting) {
                    intersectionObserver.unobserve(node)
                }
            })
            const mutationObserver = new MutationObserver(measureDOMNode)
            mutationObserver.observe(root, { childList: true, subtree: true })
            intersectionObserver.observe(node)
            window.addEventListener('resize', measureDOMNode)
            window.addEventListener('scroll', debouncedUpdate, true)
        }, [])
        const [tutorialState, currentModule, currentStep, tutorials] = useUnit([
            tutorialModel.stores.tutorialState,
            tutorialModel.stores.currentModule,
            tutorialModel.stores.currentStep,
            tutorialModel.stores.tutorials,
        ])

        if (!portal || !position || !tutorialState || !tutorials || !currentModule || !props.tutorialModule)
            return <WrappedComponent forwardedRef={handleRef} {...props} />

        const { title, description } = currentModule.steps[currentStep]
        const { id, step } = props.tutorialModule
        const completed = tutorials[id]?.completed
        const lastStep = currentModule ? currentStep === currentModule.steps.length - 1 : 0

        if (!visible) return <WrappedComponent forwardedRef={handleRef} {...props} />

        return (
            <>
                <WrappedComponent forwardedRef={handleRef} {...props} />
                {(animation === 'out' ||
                    ((typeof step === 'number' ? step === currentStep : step.some((step) => step === currentStep)) &&
                        id === currentModule.id &&
                        !completed)) &&
                    ReactDOM.createPortal(
                        <>
                            <Blocker
                                onClick={() => {
                                    setClickCounter(clickCounter + 1)
                                    if (clickCounter > 1) {
                                        setAnimation('out')

                                        setTimeout(() => {
                                            tutorialModel.events.moduleCompleted(id)
                                            setAnimation('removed')
                                        }, 300)
                                    }
                                }}
                            />
                            <Layout
                                dimensions={dimensions}
                                position={position}
                                lastStep={animation === 'out'}
                                noPadding={props.tutorialModule.params?.noPadding}
                            ></Layout>
                            <Hint
                                pageWidth={width}
                                dimensions={dimensions}
                                childPosition={position}
                                relativePosition={props.tutorialModule.params?.position || 'right'}
                                lastStep={animation === 'out'}
                            >
                                <Title size={4} align="left">
                                    {title}
                                </Title>
                                <Description>{description}</Description>
                                <Buttons jc="flex-end" gap="20px">
                                    <Button
                                        disabled={step == 0}
                                        onClick={() => {
                                            tutorialModel.events.prevStep()
                                        }}
                                    >
                                        <FaArrowLeftLong />
                                    </Button>
                                    <div>
                                        {currentStep + 1} / {currentModule.steps.length}
                                    </div>
                                    <Button
                                        onClick={() => {
                                            if (lastStep) {
                                                setAnimation('out')

                                                setTimeout(() => {
                                                    tutorialModel.events.moduleCompleted(id)
                                                    setAnimation('removed')
                                                }, 300)
                                            } else tutorialModel.events.nextStep()
                                        }}
                                    >
                                        {lastStep ? <FaCheck /> : <FaArrowRightLong />}
                                    </Button>
                                </Buttons>
                            </Hint>
                            <SkipButton setAnimation={(val) => setAnimation(val)} />
                        </>,
                        portal,
                    )}
            </>
        )
    }

    return TutWrapper
}

const Blocker = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 4;
`

const FadeIn = keyframes`
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
`

export const FadeOut = keyframes`
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }`

const BGFadeIn = keyframes`
        0% {
            background-color: rgba(0, 0, 0, 0.66);
        }
        100% {
            background-color: rgba(0, 0, 0, 0);
        }
        `

const Layout = styled.div<{
    dimensions: Dimensions
    position: Position
    lastStep?: boolean
    noPadding?: boolean
}>`
    pointer-events: none;
    position: fixed;
    top: ${({ position: { top }, noPadding }) => (noPadding ? top : top - 10)}px;
    left: ${({ position: { left }, noPadding }) => (noPadding ? left : left - 10)}px;
    z-index: 6;

    width: ${({ dimensions: { width }, noPadding }) => (noPadding ? width : width + 20)}px;
    height: ${({ dimensions: { height }, noPadding }) => (noPadding ? height : height + 20)}px;

    padding: ${({ noPadding }) => (noPadding ? '0' : '10px')};

    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.66) 0px 0px 0px 10000px;

    animation: ${({ lastStep }) => (lastStep ? FadeOut : BGFadeIn)} 0.2s ease-in forwards;
`

const Hint = styled.div<{
    pageWidth: number
    dimensions: Dimensions
    childPosition: Position
    relativePosition: HintPosition
    lastStep?: boolean
}>`
    position: fixed;
    z-index: 6;
    bottom: 0;
    left: 0;

    width: calc(100% - 16px);
    margin: 8px;
    padding: 20px 30px;

    border-radius: 15px;

    color: #f4f4f4;
    background: rgba(95, 109, 236, 0.6);
    backdrop-filter: blur(6.5px);

    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;

    @media (min-width: 1000px) {
        min-width: 250px;
        width: 20%;
        max-width: 600px;

        top: ${({ dimensions: { height }, childPosition: { top }, relativePosition }) => {
            switch (relativePosition) {
                case 'bottom':
                    return top + height + 10
                case 'top':
                    return top - 30
                default:
                    return top - 20
            }
        }}px;
        left: ${({ pageWidth, dimensions: { width }, childPosition: { left }, relativePosition }) => {
            switch (relativePosition) {
                case 'bottom':
                case 'top':
                    return pageWidth - left > 250 ? left - 20 + 'px' : 'auto'
                case 'left':
                    return 'auto'
                case 'right':
                    return left + width + 10 + 'px'
            }
        }};
        right: ${({ pageWidth, dimensions: { width }, childPosition: { left, right }, relativePosition }) => {
            switch (relativePosition) {
                case 'bottom':
                case 'top':
                case 'right':
                    return pageWidth - left - width - 20 > 250 ? 'auto' : '10px'
                case 'left':
                    return pageWidth - right + width + 10 + 'px'
            }
        }};
        transform: translateY(${({ relativePosition }) => (relativePosition === 'top' ? '-100%' : '0')});
        bottom: auto;

        margin: 10px;
        animation: ${({ lastStep }) => (lastStep ? FadeOut : FadeIn)} 200ms ease-in forwards;
    }
`

const Description = styled.div`
    margin-top: 20px;
    font-size: 12px;
    line-height: 140%;
`

const Buttons = styled(Flex)`
    margin-top: 30px;
    left: 0;
`

const Button = styled.button`
    max-width: 26px;
    aspect-ratio: 1;
    background-color: transparent;
    border: none;
    padding: 0;
    color: #f4f4f4;

    :disabled {
        opacity: 0.5;
    }

    :not(:disabled) {
        cursor: pointer;
    }
    &:hover:not(:disabled) {
        opacity: 0.7;
    }
    &:focus {
        outline: none;
    }
`
