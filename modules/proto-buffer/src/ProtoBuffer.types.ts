import type { StyleProp, ViewStyle } from "react-native"

export type OnLoadEventPayload = {
  url: string
}

export type ProtoBufferModuleEvents = {
  onChange: (params: ChangeEventPayload) => void
}

export type ChangeEventPayload = {
  value: string
}

export type ProtoBufferViewProps = {
  url: string
  onLoad: (event: { nativeEvent: OnLoadEventPayload }) => void
  style?: StyleProp<ViewStyle>
}

export type Data = {
  value: string
  timestamp: number
}

export type EncodeData = {
  sensor: string
  config: string
  freq: number
  data: Data[]
}
