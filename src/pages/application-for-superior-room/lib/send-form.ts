import { SelectPage } from '@features/select'
import { CheckboxDocs, IInputArea, IInputAreaData } from '@ui/input-area/model'

const sendForm = (form: IInputArea) => {
    const data = (form.data as IInputAreaData[]).reduce((acc, item) => {
        if (item.type === 'checkbox-docs') {
            acc[item.fieldName] = (item.items as CheckboxDocs[])?.reduce((obj, element) => {
                obj[element.fieldName] = element.files
                return obj
            }, {} as { [key: string]: any })
        } else if (item.type === 'select') {
            acc[item.fieldName] = (item.value as SelectPage).title
        } else {
            acc[item.fieldName] = item.value
        }
        return acc
    }, {} as { [key: string]: any })
    // eslint-disable-next-line no-console
    console.log(data)
}

export default sendForm