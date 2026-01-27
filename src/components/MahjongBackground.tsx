interface MahjongBackgroundProps {
  opacity?: number;
}

export default function MahjongBackground({ opacity = 0.06 }: MahjongBackgroundProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="mahjong-pattern"
            x="0"
            y="0"
            width="100"
            height="140"
            patternUnits="userSpaceOnUse"
          >
            {/* Tile 1 - Red Dragon 中 */}
            <g transform="translate(10, 10)">
              <rect
                x="0"
                y="0"
                width="35"
                height="50"
                rx="3"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
              />
              <text
                x="17.5"
                y="33"
                fontSize="20"
                fill="white"
                textAnchor="middle"
                fontWeight="bold"
              >
                中
              </text>
            </g>

            {/* Tile 2 - Green Dragon 發 */}
            <g transform="translate(55, 25)">
              <rect
                x="0"
                y="0"
                width="35"
                height="50"
                rx="3"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
              />
              <text
                x="17.5"
                y="33"
                fontSize="20"
                fill="white"
                textAnchor="middle"
                fontWeight="bold"
              >
                發
              </text>
            </g>

            {/* Tile 3 - Circles (3 dots) */}
            <g transform="translate(25, 80)">
              <rect
                x="0"
                y="0"
                width="35"
                height="50"
                rx="3"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
              />
              <circle cx="17.5" cy="18" r="5" fill="none" stroke="white" strokeWidth="1.5" />
              <circle cx="10" cy="35" r="5" fill="none" stroke="white" strokeWidth="1.5" />
              <circle cx="25" cy="35" r="5" fill="none" stroke="white" strokeWidth="1.5" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mahjong-pattern)" />
      </svg>
    </div>
  );
}
