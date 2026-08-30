import { Component, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  fallback: (retry: () => void) => ReactNode
  onReset?: () => void
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

// Suspense 의 에러 짝. useSuspenseQuery 는 로딩 중엔 Suspense 로, 실패하면 여기로 던진다.
// onReset(QueryErrorResetBoundary 의 reset)을 먼저 불러야 같은 쿼리가 다시 suspend 될 수 있다.
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  retry = () => {
    this.props.onReset?.()
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) return this.props.fallback(this.retry)
    return this.props.children
  }
}
