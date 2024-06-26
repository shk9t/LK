import { applicationsModel } from '@entities/applications'
import { SpecialFieldsNameConfig } from '@entities/applications/consts'
import BaseApplicationWrapper from '@pages/applications/ui/base-application-wrapper'
import sendHrFormWorkTransfer from '@pages/hr-applications/lib/send-hr-form-work-transfer'
import { $hrDivisions } from '@pages/hr-applications/model/divisions'
import { FormBlock, SubmitButton } from '@ui/atoms'
import InputArea from '@ui/input-area'
import { IInputArea, IInputAreaData } from '@ui/input-area/model'
import { ApplicationFormCodes } from '@utility-types/application-form-codes'
import checkFormFields from '@utils/check-form-fields'
import { useUnit } from 'effector-react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { bufferWorkTransferModel } from '../buffer-work-transfer/model'
import getForm from './lib/get-form'
import getPostAfterTransfer from './lib/get-post-after-transfer'

type LoadedState = React.Dispatch<React.SetStateAction<IInputArea>>

const WorkTransferChangeRate = () => {
    const [form, setForm] = useState<IInputArea | null>(null)
    const {
        data: { dataUserApplication, dataWorkerApplication },
    } = applicationsModel.selectors.useApplications()
    const { loading: loading } = bufferWorkTransferModel.selectors.useBufferWorkTransfer()
    const [completed, setCompleted] = useState(false)
    const [specialFieldsName, setSpecialFieldsName] = useState<SpecialFieldsNameConfig>({})
    const divisions = useUnit($hrDivisions)
    const isDone = completed ?? false
    const { id } = useParams<{ id: string }>()
    const currentIndex = +id
    useEffect(() => {
        if (!!form && !!dataUserApplication) {
            setSpecialFieldsName(getPostAfterTransfer(form.data as IInputAreaData[]))
        }
    }, [form])

    useEffect(() => {
        if (!!dataUserApplication && !!dataWorkerApplication && !loading) {
            setForm(getForm(dataUserApplication, dataWorkerApplication, currentIndex))
        }
    }, [dataUserApplication, currentIndex, loading])

    return (
        <BaseApplicationWrapper isDone={isDone}>
            {!!form && !!setForm && (
                <FormBlock>
                    <InputArea
                        {...form}
                        collapsed={isDone}
                        setData={setForm as LoadedState}
                        specialFieldsNameConfig={specialFieldsName}
                    />

                    <SubmitButton
                        text={'Отправить'}
                        action={() =>
                            sendHrFormWorkTransfer(ApplicationFormCodes.HOLIDAY_WORK, [form], setCompleted, divisions)
                        }
                        isLoading={loading}
                        completed={completed}
                        setCompleted={setCompleted}
                        repeatable={false}
                        buttonSuccessText="Отправлено"
                        isDone={isDone}
                        isActive={checkFormFields(form) && (form.optionalCheckbox?.value ?? true)}
                        popUpFailureMessage={'Для отправки формы необходимо, чтобы все поля были заполнены'}
                        popUpSuccessMessage="Данные формы успешно отправлены"
                    />
                </FormBlock>
            )}
        </BaseApplicationWrapper>
    )
}

export default WorkTransferChangeRate
