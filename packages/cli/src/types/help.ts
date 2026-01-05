export interface HelpItem {
  step?: number
  text: string
  important?: boolean
}

export interface HelpSection {
  title: string
  items: HelpItem[]
}

export interface HelpContent {
  title: string
  titleColor?: string
  errorCode?: string | number
  sections: HelpSection[]
  footer?: {
    text: string
    color?: string
  }
}

export type HelpContentMap = Record<string | number, HelpContent>
