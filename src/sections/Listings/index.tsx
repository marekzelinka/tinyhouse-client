import { useQuery } from '@apollo/client'
import { Affix, Layout, List, Typography } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { ErrorBanner, ListingCard } from '../../lib/components'
import { ListingsFilter } from '../../lib/graphql/globalTypes'
import { LISTINGS } from '../../lib/graphql/queries'
import {
  Listings as ListingsData,
  ListingsVariables,
} from '../../lib/graphql/queries/Listings/__generated__/Listings'
import { useScrollTop } from '../../lib/hooks'
import {
  ListingsFilters,
  ListingsPagination,
  ListingsSkeleton,
} from './components'

const { Content } = Layout
const { Title, Paragraph, Text } = Typography

const PAGE_LIMIT = 8

export const Listings = () => {
  useScrollTop()
  const { location } = useParams<{ location: string }>()
  const locationRef = useRef(location)
  const [filter, setFilter] = useState(ListingsFilter.PRICE_LOW_TO_HIGH)
  const [page, setPage] = useState(1)
  const { data, loading, error } = useQuery<ListingsData, ListingsVariables>(
    LISTINGS,
    {
      skip: locationRef.current !== location && page !== 1,
      variables: { location, filter, limit: PAGE_LIMIT, page },
    }
  )

  useEffect(() => {
    setPage(1)
    locationRef.current = location
  }, [location])

  if (loading) {
    return (
      <Content className="listings">
        <ListingsSkeleton />
      </Content>
    )
  }

  if (error) {
    return (
      <Content className="listings">
        <ErrorBanner description="We either couldn't find anything matching your search or have encountered an error. If you're searching for a unique location, try searching again with more common keywords." />
        <ListingsSkeleton />
      </Content>
    )
  }

  const listings = data?.listings
  const listingsRegion = listings?.region

  const listingsSectionElement = listings?.result.length ? (
    <div>
      <Affix offsetTop={64}>
        <div>
          <ListingsPagination
            total={listings.total}
            page={page}
            limit={PAGE_LIMIT}
            setPage={setPage}
          />
          <ListingsFilters filter={filter} setFilter={setFilter} />
        </div>
      </Affix>
      <List
        grid={{ gutter: 8, column: 4, xs: 1, sm: 2, lg: 4 }}
        dataSource={listings.result}
        renderItem={(listing) => (
          <List.Item>
            <ListingCard listing={listing} />
          </List.Item>
        )}
      />
    </div>
  ) : (
    <div>
      <Paragraph>
        It appears that no listings have yet been created for{' '}
        <Text mark>"{listingsRegion}"</Text>
      </Paragraph>
      <Paragraph>
        Be the first person to create a{' '}
        <Link to="/host">listing in this area</Link>!
      </Paragraph>
    </div>
  )

  const listingsRegionElement = listingsRegion ? (
    <Title level={3} className="listings__title">
      Result for "{listingsRegion}"
    </Title>
  ) : null

  return (
    <Content className="listings">
      {listingsRegionElement}
      {listingsSectionElement}
    </Content>
  )
}
