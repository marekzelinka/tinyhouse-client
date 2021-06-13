import { useQuery } from '@apollo/client'
import { Col, Layout, Row } from 'antd'
import { useState } from 'react'
import { useParams } from 'react-router'
import { ErrorBanner, PageSkeleton } from '../../lib/components'
import { USER } from '../../lib/graphql/queries'
import {
  User as UserData,
  UserVariables,
} from '../../lib/graphql/queries/User/__generated__/User'
import { useScrollTop } from '../../lib/hooks'
import { Viewer } from '../../lib/types'
import { UserBookings, UserListings, UserProfile } from './components'

const { Content } = Layout

const PAGE_LIMIT = 4

interface Props {
  viewer: Viewer
  setViewer: (viewer: Viewer) => void
}

export const User = ({ viewer, setViewer }: Props) => {
  useScrollTop()
  const { id } = useParams<{ id: string }>()
  const [listingsPage, setListingsPage] = useState(1)
  const [bookingsPage, setBookingsPage] = useState(1)
  const { data, loading, error, refetch } = useQuery<UserData, UserVariables>(
    USER,
    {
      variables: { id, bookingsPage, listingsPage, limit: PAGE_LIMIT },
      fetchPolicy: 'network-only',
    }
  )

  const stripeError = new URL(window.location.href).searchParams.get(
    'stripe_error'
  )
  const stripeErrorBanner = stripeError ? (
    <ErrorBanner description="We had an issue connecting with Stripe. Please try again soon." />
  ) : null

  const handleUserRefetch = async () => {
    await refetch()
  }

  if (loading) {
    return (
      <Content className="user">
        <PageSkeleton />
      </Content>
    )
  }

  if (error) {
    return (
      <Content className="user">
        <ErrorBanner description="This user may not exist or we've encountered an error. Please try again soon." />
        <PageSkeleton />
      </Content>
    )
  }

  const user = data?.user
  const viewerIsUser = viewer.id === id

  const userListings = user?.listings
  const userBookings = user?.bookings

  const userProfileElement = user ? (
    <UserProfile
      user={user}
      viewer={viewer}
      viewerIsUser={viewerIsUser}
      setViewer={setViewer}
      handleUserRefetch={handleUserRefetch}
    />
  ) : null

  const userListingsElement = userListings ? (
    <UserListings
      userListings={userListings}
      listingsPage={listingsPage}
      limit={PAGE_LIMIT}
      setListingsPage={setListingsPage}
    />
  ) : null

  const userBookingsElement = userBookings ? (
    <UserBookings
      userBookings={userBookings}
      bookingsPage={bookingsPage}
      limit={PAGE_LIMIT}
      setBookingsPage={setBookingsPage}
    />
  ) : null

  return (
    <Content className="user">
      {stripeErrorBanner}
      <Row gutter={12} justify="space-between">
        <Col xs={24}>{userProfileElement}</Col>
        <Col xs={24}>
          {userListingsElement}
          {userBookingsElement}
        </Col>
      </Row>
    </Content>
  )
}
