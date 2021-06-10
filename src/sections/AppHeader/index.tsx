import { Input, Layout } from 'antd'
import { useEffect, useState } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { Viewer } from '../../lib/types'
import { displayErrorMessage } from '../../lib/utils'
import logo from './assets/tinyhouse-logo.png'
import { MenuItems } from './components'

const { Header } = Layout
const { Search } = Input

interface Props {
  viewer: Viewer
  setViewer: (viewer: Viewer) => void
}

export const AppHeader = ({ viewer, setViewer }: Props) => {
  const location = useLocation()
  const [search, setSearch] = useState('')

  useEffect(() => {
    const { pathname } = location
    const pathnameSubStrings = pathname.split('/')

    if (!pathname.includes('/listings')) {
      setSearch('')
    } else if (pathnameSubStrings.length === 3) {
      setSearch(pathnameSubStrings[2])
    }
  }, [location])

  const history = useHistory()
  const onSearch = (value: string) => {
    const trimmedValue = value.trim()

    if (trimmedValue.length === 0) {
      displayErrorMessage('Please enter a valid search!')
      return
    }

    history.push(`/listings/${trimmedValue}`)
  }

  return (
    <Header className="app-header">
      <div className="app-header__logo-search-section">
        <div className="app-header__logo">
          <Link to="/">
            <img src={logo} alt="App logo" />
          </Link>
        </div>
        <div className="app-header__search-input">
          <Search
            placeholder="Search 'San Fransisco'"
            enterButton
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSearch={onSearch}
          />
        </div>
      </div>
      <div className="app-header__menu-section">
        <MenuItems viewer={viewer} setViewer={setViewer} />
      </div>
    </Header>
  )
}
