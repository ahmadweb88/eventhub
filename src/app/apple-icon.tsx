import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1A1F36',
      }}
    >
      <svg width="120" height="120" viewBox="0 0 40 40">
        <rect x="5" y="9" width="30" height="26" rx="7" fill="#FFFFFF" />
        <rect x="11" y="4" width="4" height="9" rx="2" fill="#FF8A65" />
        <rect x="25" y="4" width="4" height="9" rx="2" fill="#FF8A65" />
        <circle cx="26" cy="27" r="4" fill="#FF8A65" />
      </svg>
    </div>,
    size,
  )
}
