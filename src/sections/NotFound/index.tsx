import { Empty, Layout, Typography } from 'antd'
import { Link } from 'react-router-dom'
import { useScrollTop } from '../../lib/hooks'

const { Content } = Layout
const { Text } = Typography

export const NotFound = () => {
  useScrollTop()

  return (
    <Content className="not-found">
      <Empty
        description={
          <>
            <Text className="not-found__description-title">
              Uh oh! Something went wrong :(
            </Text>
            <Text className="not-found__description-subtitle">
              The page you're looking for can't be found
            </Text>
          </>
        }
      />
      <Link
        to="/"
        className="not-found__cta ant-bnt ant-btn-primary ant-btn-lg"
      >
        Go to Home
      </Link>
    </Content>
  )
}
