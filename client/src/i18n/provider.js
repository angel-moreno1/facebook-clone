import { Fragment } from 'react'
import { IntlProvider } from 'react-intl'
import { LOCALES } from './locales'
import messages from './messages'

const Provider = props => {
    const { children, locale = LOCALES.ENGLISH } = props

    return (
        <IntlProvider
            locale={locale}
            textComponent={Fragment}
            messages={messages[locale]} 
        >
            {
                children
            }
        </IntlProvider>
    )
}

export default Provider