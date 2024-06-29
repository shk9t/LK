import { tutorialModel } from '@entities/tutorial'
import { useUnit } from 'effector-react'
import { useEffect } from 'react'
import { useLocation } from 'react-router'

export const useSetTutorial = () => {
    const location = useLocation()
    const path = location.pathname

    const [tutorials, currentModule, setCurrentTutorial, resetStep] = useUnit([
        tutorialModel.stores.tutorials,
        tutorialModel.stores.currentModule,
        tutorialModel.events.setCurrentTutorial,
        tutorialModel.events.resetStep,
    ])

    useEffect(() => {
        if (tutorials) {
            const tutorial = Object.values(tutorials).find((tutorial) => tutorial.path === path)
            if (!tutorial) setCurrentTutorial(null)
            else {
                if (currentModule?.id !== tutorial.id) {
                    setCurrentTutorial(tutorial.id)
                    resetStep()
                }
            }
        }
    }, [tutorials, path])
}
