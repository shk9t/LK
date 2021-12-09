import React from 'react'
import MenuButton from '../../../features/header/ui/molecules/menu-button'
import SettingsButton from '../../../features/header/ui/molecules/settings-button'
import useCurrentPage from '../../lib/hooks/use-current-page'
import useResize from '../../lib/hooks/use-resize'
import HeaderWrapper from '../atoms/header-wrapper'

const Header = () => {
    const { width } = useResize()
    const { title } = useCurrentPage()
    return (
        <HeaderWrapper>
            <div className="header-button-and-title">
                {width < 1000 && <MenuButton />}
                <h3>{title}</h3>
            </div>
            <SettingsButton />
        </HeaderWrapper>
    )
}

export default React.memo(Header)
