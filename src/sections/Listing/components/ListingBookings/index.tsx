import { Avatar, Divider, List, Typography } from 'antd'
import { Link } from 'react-router-dom'
import { Listing as ListingData } from '../../../../lib/graphql/queries/Listing/__generated__/Listing'

const { Title, Text } = Typography

interface Props {
  listingBookings: NonNullable<ListingData['listing']['bookings']>
  bookingsPage: number
  limit: number
  setBookingsPage: (bookingsPage: number) => void
}

export const ListingBookings = ({
  listingBookings,
  bookingsPage,
  limit,
  setBookingsPage,
}: Props) => {
  const { total, result } = listingBookings

  const listingBookingsList = (
    <List
      grid={{ gutter: 8, column: 4, xs: 1, sm: 2, lg: 4 }}
      dataSource={result}
      locale={{ emptyText: 'No bookings have been made yet!' }}
      pagination={{
        current: bookingsPage,
        total,
        defaultPageSize: limit,
        hideOnSinglePage: true,
        showLessItems: true,
        onChange: (page) => setBookingsPage(page),
      }}
      renderItem={(listingBooking) => {
        const bookingHistory = (
          <div className="listing-bookings__history">
            <div>
              Check in: <Text strong>{listingBooking.checkIn}</Text>
            </div>
            <div>
              Check out: <Text strong>{listingBooking.checkOut}</Text>
            </div>
          </div>
        )

        return (
          <List.Item className="listing-bookings__item">
            {bookingHistory}
            <Link to={`/user/${listingBooking.tenant.id}`}>
              <Avatar
                src={listingBooking.tenant.avatar}
                size={64}
                shape="square"
              />
            </Link>
          </List.Item>
        )
      }}
    />
  )

  return (
    <div className="listing-bookings">
      <Divider />
      <div className="listing-bookings__section">
        <Title level={4} className="listing-bookings__title">
          Bookings
        </Title>
      </div>
      {listingBookingsList}
    </div>
  )
}
