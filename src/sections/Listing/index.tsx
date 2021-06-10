import { useQuery } from '@apollo/client'
import { Col, Layout, Row } from 'antd'
import { useState } from 'react'
import { useParams } from 'react-router'
import { ErrorBanner, PageSkeleton } from '../../lib/components'
import { LISTING } from '../../lib/graphql/queries'
import {
  Listing as ListingData,
  ListingVariables,
} from '../../lib/graphql/queries/Listing/__generated__/Listing'
import { ListingDetails } from './components'

const { Content } = Layout

const PAGE_LIMIT = 4

export const Listing = () => {
  const { id } = useParams<{ id: string }>()
  const [bookingsPage, setBookingsPage] = useState(1)
  const { data, loading, error } = useQuery<ListingData, ListingVariables>(
    LISTING,
    {
      variables: {
        id: id,
        bookingsPage,
        limit: PAGE_LIMIT,
      },
    }
  )

  if (loading) {
    return (
      <Content className="listings">
        <PageSkeleton />
      </Content>
    )
  }

  if (error) {
    return (
      <Content className="listings">
        <ErrorBanner description="This listing may not exist or we've encountered an error. Please try again soon." />
        <PageSkeleton />
      </Content>
    )
  }

  const listing = data?.listing

  const listingBookings = listing?.bookings

  const listingDetailsElement = listing ? (
    <ListingDetails listing={listing} />
  ) : null

  return (
    <Content className="listings">
      <Row gutter={24} justify="space-between">
        <Col xs={24} lg={14}>
          {listingDetailsElement}
        </Col>
      </Row>
    </Content>
  )
}
