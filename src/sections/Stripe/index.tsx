import { useMutation } from '@apollo/client'
import { Layout, Spin } from 'antd'
import { useEffect, useRef } from 'react'
import { Redirect, useHistory } from 'react-router'
import { CONNECT_STRIPE } from '../../lib/graphql/mutations'
import {
  ConnectStripe,
  ConnectStripeVariables,
} from '../../lib/graphql/mutations/ConnectStripe/__generated__/ConnectStripe'
import { useScrollTop } from '../../lib/hooks'
import { Viewer } from '../../lib/types'
import { displaySuccessNotification } from '../../lib/utils'

const { Content } = Layout

interface Props {
  viewer: Viewer
  setViewer: (viewer: Viewer) => void
}

export const Stripe = ({ viewer, setViewer }: Props) => {
  useScrollTop()
  const [connectStripe, { data, loading, error }] = useMutation<
    ConnectStripe,
    ConnectStripeVariables
  >(CONNECT_STRIPE, {
    onCompleted: (data) => {
      setViewer({ ...viewer, ...data.connectStripe })
      displaySuccessNotification(
        "You've successfully conencted your Stripe Account!",
        'You can now begin to create listings in the Host page.'
      )
    },
  })
  const connectStripeRef = useRef(connectStripe)
  const history = useHistory()

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code')
    if (code) {
      connectStripeRef.current({ variables: { input: { code } } })
    } else {
      history.replace('/login')
    }
  }, [history])

  if (data?.connectStripe) {
    return <Redirect to={`/user/${viewer.id}`} />
  }

  if (loading) {
    return (
      <Content className="stripe">
        <Spin size="large" tip="Connecting your Stripe account..." />
      </Content>
    )
  }

  if (error) {
    return <Redirect to={`/user/${viewer.id}?stripe_error=true`} />
  }

  return null
}
