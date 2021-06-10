import { List, Typography } from 'antd'
import { ListingCard } from '../../../../lib/components'
import { User as UserData } from '../../../../lib/graphql/queries/User/__generated__/User'

const { Paragraph, Title, Text } = Typography

interface Props {
  userBookings: NonNullable<UserData['user']['bookings']>
  bookingsPage: number
  limit: number
  setBookingsPage: (bookingsPage: number) => void
}

export const Userbookings = ({
  userBookings,
  bookingsPage,
  limit,
  setBookingsPage,
}: Props) => {
  const { total, result } = userBookings

  const userBookingsList = (
    <List
      grid={{ gutter: 8, column: 4, xs: 1, sm: 2, lg: 4 }}
      dataSource={result}
      locale={{ emptyText: "You haven't made any bookings!" }}
      pagination={{
        position: 'top',
        current: bookingsPage,
        total,
        defaultPageSize: limit,
        hideOnSinglePage: true,
        showLessItems: true,
        onChange: (page) => setBookingsPage(page),
      }}
      renderItem={(userBooking) => {
        const bookingHistory = (
          <div className="user-bookings__booking-history">
            <div>
              Check in: <Text strong>{userBooking.checkIn}</Text>
            </div>
            <div>
              Check out: <Text strong>{userBooking.checkOut}</Text>
            </div>
          </div>
        )

        return (
          <List.Item>
            {bookingHistory}
            <ListingCard listing={userBooking.listing} />
          </List.Item>
        )
      }}
    />
  )

  return (
    <div className="user-bookings">
      <Title level={4} className="user-bookings__title">
        Bookings
      </Title>
      <Paragraph className="user-listings__description">
        This section highlights the bookings you've made, and the
        check-in/check-out dates associated with said bookings.
      </Paragraph>
      {userBookingsList}
    </div>
  )
}
