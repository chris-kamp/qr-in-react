import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Container, Heading, Columns } from 'react-bulma-components'
import PromotionCard from './PromotionCard'
import PageHeading from '../shared/PageHeading'

const Promotions = () => {
    const [promotions, setPromotions] = useState([])

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_ENDPOINT}/promotions`)
            .then(response => {
                console.debug(response)
                setPromotions(response.data)
            })
    }, [])

    return (
        <Container>
            <PageHeading>Browse Promotions</PageHeading>
            <Columns>
                {promotions.length > 0 ? promotions.map((promotion) => (
                    <Columns.Column
                        desktop={{ size: 'half' }}
                        tablet={{ size: 'full' }}
                        key={promotion.id}
                    >
                        <PromotionCard key={promotion.id} promotion={promotion} business={promotion.business}></PromotionCard>
                    </Columns.Column>
                )) : (
                    <Columns.Column size={'full'}>
                        <Heading size={4}>No Promotions Found</Heading>
                    </Columns.Column>
                )}
            </Columns>
        </Container>
    )
}

export default Promotions
