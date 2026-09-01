export interface PlaygroundConfig {
  name: string
  manifestUrl: string
  iconUrl?: string
  sdkVersion: string
}

export interface SdkSource {
  version: string
  url: string
  local?: boolean
}
