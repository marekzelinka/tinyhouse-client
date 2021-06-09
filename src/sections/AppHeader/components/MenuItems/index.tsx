import { Button, Menu, Avatar } from 'antd'
import { HomeOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { useApolloClient, useMutation } from '@apollo/client'
import { Viewer } from '../../../../lib/types'
import { LOG_OUT } from '../../../../lib/graphql/mutations'
import { LogOut as LogOutData } from '../../../../lib/graphql/mutations/LogOut/__generated__/LogOut'
import {
  displayErrorMessage,
  displaySuccessNotification,
} from '../../../../lib/utils'

const { Item, SubMenu } = Menu

interface Props {
  viewer: Viewer
  setViewer: (viewer: Viewer) => void
}

export const MenuItems = ({ viewer, setViewer }: Props) => {
  const client = useApolloClient()
  const [logOut] = useMutation<LogOutData>(LOG_OUT, {
    onCompleted: (data) => {
      setViewer(data.logOut)
      sessionStorage.removeItem('token')
      client.resetStore()
      displaySuccessNotification("You've successfully logged out!")
    },
    onError: () => {
      displayErrorMessage(
        "Sorry! We weren't able to log you out. Please try again later!"
      )
    },
  })

  const handleLogOut = () => {
    logOut()
  }

  const subMenuLogin =
    viewer.id && viewer.avatar ? (
      <SubMenu key="SubMenu" title={<Avatar src={viewer.avatar} />}>
        <Item key={`/user/${viewer.id}`}>
          <Link to={`/user/${viewer.id}`}></Link>
          <UserOutlined /> Profile
        </Item>
        <Item key="/logout">
          <div onClick={handleLogOut}>
            <LogoutOutlined /> Log out
          </div>
        </Item>
      </SubMenu>
    ) : (
      <Item key="/login">
        <Link to="/login">
          <Button type="primary">Sign In</Button>
        </Link>
      </Item>
    )

  return (
    <Menu mode="horizontal" selectable={false} className="menu">
      <Item key="/host">
        <Link to="/host">
          <HomeOutlined /> Host
        </Link>
      </Item>
      {subMenuLogin}
    </Menu>
  )
}
