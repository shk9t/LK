import { ApplicationsConstants } from '@entities/applications/consts'
import { Message } from '@ui/message'
import { ColumnProps } from '@ui/table/types'
import React from 'react'
import localizeDate from '@utils/localize-date'

const getApplicationsColumns = (): ColumnProps[] => {
    return [
        { title: 'Запрос', field: 'subject', priority: 'one', search: true },
        {
            title: 'Дата',
            field: 'created',
            priority: 'two',
            sort: true,
            render: (value) => <>{localizeDate(value)}</>,
        },
        {
            title: 'Рег. номер',
            field: 'num',
            priority: 'three',
            catalogs: [
                { id: 0, title: '3214141da' },
                { id: 1, title: '3214141db' },
            ],
        },
        {
            title: 'Статус',
            field: 'status',
            priority: 'one',
            width: '160px',
            catalogs: [
                ...(Object.values(ApplicationsConstants).map((val, i) => ({ id: i.toString(), title: val })) ?? []),
            ],
            render: (value) => (
                <Message
                    type={value === 'Готово' ? 'success' : value === 'Отклонено' ? 'failure' : 'alert'}
                    title={value}
                    align="center"
                    width="100%"
                    icon={null}
                    maxWidth="150px"
                />
            ),
        },
        { title: 'Структурное подразделение, адрес', priority: 'five', field: 'response_div', width: '360px' },
        { title: 'Примечание', field: 'comment', priority: 'five' },
    ]
}

export default getApplicationsColumns
