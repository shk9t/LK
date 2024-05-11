import { applicationsModel } from '@entities/applications'
import getApplicationsColumns from '@features/applications/lib/get-applications-columns'
import { getNormalizedApplications } from '@features/applications/lib/get-normalized-applications'
import { getExtendedApplicationsColumns } from '@features/applications/lib/get-extended-application-columns'
import CreateApplicationList from '@features/applications/ui/molecules/create-application-list'
import PageBlock from '@shared/ui/page-block'
import { Button, Message, Wrapper } from '@ui/atoms'
import Table from '@ui/table'
import React, { memo, useCallback } from 'react'
import { FiInfo, FiPlus } from 'react-icons/fi'
import { useModal } from 'widgets'

interface Props {
    isTeachers: boolean
}

const TeachersHrApplicationsPage = ({ isTeachers }: Props) => {
    const {
        data: { listApplication, dataUserApplication },
    } = applicationsModel.selectors.useApplications()
    const { open } = useModal()

    const handleOpenModal = useCallback(() => {
        open(
            <CreateApplicationList isTeachers={isTeachers} currentFormEducation={dataUserApplication?.educationForm} />,
            'Создать заявку',
        )
    }, [])

    return (
        <Wrapper
            load={() => applicationsModel.effects.getApplicationsFx()}
            loading={!listApplication}
            // Метод getWorkerData работает нестабильно. Для этого раздела он не нужен, но ошибку ставит именно в этот стор.
            // Таким образом все запросы отрабатывают корректно, но все равно отображается ошибка.
            error={null}
            data={listApplication}
        >
            <PageBlock
                topRightCornerElement={
                    <Button
                        onClick={handleOpenModal}
                        text="Подать заявку"
                        background="var(--reallyBlue)"
                        textColor="#fff"
                        icon={<FiPlus />}
                        minWidth="35px"
                        height="36px"
                        shrinkTextInMobile
                    />
                }
            >
                <Message type="info" title="Информация" icon={<FiInfo />} lineHeight="1.4rem" fontSize="0.85rem">
                    <p>
                        Данный сервис позволяет заказать необходимую справку, подать заявление, запрос. Статус
                        (информация о степени готовности) заказанных справок меняется согласно действиям оператора. В
                        колонке «Структурное подразделение, адрес» указывается название подразделения и адрес, куда
                        необходимо приехать за готовым документом.
                        {isTeachers && (
                            <>
                                <br />
                                Остальные Цифровые сервисы доступны{' '}
                                <a
                                    href="https://e.mospolytech.ru/old/index.php?p=sprav"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    по ссылке
                                </a>
                                .
                            </>
                        )}
                    </p>
                </Message>

                <Table
                    loading={!listApplication}
                    columns={getApplicationsColumns()}
                    columnsExtended={getExtendedApplicationsColumns()}
                    data={getNormalizedApplications(listApplication)}
                    maxOnPage={7}
                />
            </PageBlock>
        </Wrapper>
    )
}

export default memo(TeachersHrApplicationsPage)
