import { ThemeVariant, REQUIRED_LEFTSIDE_BAR_CONFIG, REQUIRED_TEACHER_LEFTSIDE_BAR_CONFIG } from '@shared/constants'
import { UserSettings } from '../types'

export const getDefaultNewSettings = (isEmployee: boolean): UserSettings => {
    // get default theme from user preferences
    const theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? ThemeVariant.Dark : ThemeVariant.Light

    return {
        appearance: {
            theme,
        },
        customizeMenu: {
            pages: isEmployee ? REQUIRED_TEACHER_LEFTSIDE_BAR_CONFIG : REQUIRED_LEFTSIDE_BAR_CONFIG,
        },
        homePage: {
            pages: ['settings', 'profile', 'chat', 'schedule', 'payments', 'project-activity', 'all-students'],
            hasSchedule: true,
            hasPayment: true,
            hasNews: true,
        },
        notifications: {
            all: true,
            messages: true,
            applications: true,
            doclist: true,
            newVersion: true,
            news: true,
            schedule: true,
        },
        syncAcrossAllDevices: false,
    }
}

export type PhoneSettingsType = {
    phone_staff?: string
    allow_mobphone_in?: boolean
    allow_mobphone_out?: boolean
}
