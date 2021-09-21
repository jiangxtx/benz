export interface IProps {
  rootMargin?: string
  thresholds?: string
  wrapClass?: string
  style?: any
  onIntersecting?: (data) => void
  root?: string | HTMLHtmlElement
}
