import { List, Typography } from 'antd'
import { ListingCard } from '../../../../lib/components'
import { Listings as ListingsData } from '../../../../lib/graphql/queries/Listings/__generated__/Listings'

const { Title } = Typography

interface Props {
  title: string
  listings: ListingsData['listings']['result']
}

export const HomeListings = ({ title, listings }: Props) => {
  return (
    <div className="home-listings">
      <Title level={4} className="home-listings__title">
        {title}
      </Title>
      <List
        grid={{ gutter: 8, column: 4, xs: 1, sm: 2, lg: 4 }}
        dataSource={listings}
        renderItem={(listing) => (
          <List.Item>
            <ListingCard listing={listing} />
          </List.Item>
        )}
      />
    </div>
  )
}
