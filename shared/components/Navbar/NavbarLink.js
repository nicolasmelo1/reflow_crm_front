import React from 'react'
import Styled from './styles'
import dynamicImport from '../../utils/dynamicImport'

const Link = dynamicImport('next/link')

const NavbarLink = (props) => {
    return (
        <Link href={props.slug ? props.slug : props.link} as={props.link} passHref>
            <Styled.NavbarLinkAnchor>
                <Styled.NavbarLinkIconContainer badge={props.badge}>
                    <Styled.NavbarLinkIcon icon={props.icon} />
                </Styled.NavbarLinkIconContainer>
                <Styled.NavbarLinkLabel>{props.label}</Styled.NavbarLinkLabel>
            </Styled.NavbarLinkAnchor>
        </Link>
    )
};

export default NavbarLink