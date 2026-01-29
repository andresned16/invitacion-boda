type Props = {
  color: string
  width?: number
}

export default function LineaOndulada({ color, width = 80 }: Props) {
  return (
    <svg
      width={width}
      height="8"
      viewBox="0 0 100 10"
      preserveAspectRatio="none"
    >
      <path
        d="M0 5 Q 12.5 0 25 5 T 50 5 T 75 5 T 100 5"
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}
