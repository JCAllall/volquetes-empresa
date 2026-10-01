import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 8,
          background: '#F59E0B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 55%)',
          }}
        />
        <span style={{ color: 'white', fontSize: 20, fontWeight: 800 }}>B</span>
      </div>
    ),
    { ...size },
  )
}
