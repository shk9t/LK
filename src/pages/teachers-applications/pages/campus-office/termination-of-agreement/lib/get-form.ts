import { IInputArea } from '@ui/input-area/model'
import { UserApplication } from '@api/model'
import getBasicFieldsApplicationTeacher from '@pages/teachers-applications/lib/get-basic-fields-application-teacher'

const getForm = (data: UserApplication): IInputArea => {
    return {
        title: 'Расторжение договора найма жилого помещения',
        data: [
            ...getBasicFieldsApplicationTeacher(data),
            {
                fieldName: 'commentary',
                title: 'Комментарий',
                type: 'textarea',
                value: '',
                editable: true,
            },
        ],
    }
}

export default getForm
