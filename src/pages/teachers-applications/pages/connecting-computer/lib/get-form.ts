import { IInputArea } from '@ui/input-area/model'
import getBasicFormFields from '@pages/teachers-applications/lib/get-basic-fields-application-teacher'
import { UserApplication } from '@api/model'
import { getSiteAndAud } from '@pages/teachers-applications/lib/get-site-and-topic'
import { isProduction } from '@shared/constants'

const getForm = (data: UserApplication): IInputArea => {
    return {
        title: 'Подключение компьютера, МФУ, телефона, WiFi',
        data: [
            ...getBasicFormFields(data),
            ...(isProduction ? [] : getSiteAndAud()),
            {
                title: 'Текст заявки',
                type: 'textarea',
                fieldName: 'commentary',
                value: '',
                editable: true,
            },
        ],
        documents: isProduction ? undefined : { files: [], fieldName: 'docs', maxFiles: 6, required: false },
    }
}

export default getForm
