import { Subdivision } from '@api/model'

export const getSubDivisions = (subdivisions: Subdivision[] = []) => {
    return subdivisions.map((subdivision) => {
        return {
            id: subdivision.guid_staff,
            title: subdivision.subdivision,
        }
    })
}
