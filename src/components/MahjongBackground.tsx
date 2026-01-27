interface MahjongBackgroundProps {
  opacity?: number;
}

export default function MahjongBackground({ opacity = 0.05 }: MahjongBackgroundProps) {
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
            width="120"
            height="160"
            patternUnits="userSpaceOnUse"
          >
            {/* Mahjong tile 1 */}
            <g transform="translate(10, 10)">
              <rect
                x="0"
                y="0"
                width="40"
                height="56"
                rx="4"
                fill="white"
                stroke="white"
                strokeWidth="1"
              />
              {/* Red Dragon symbol */}
              <text
                x="20"
                y="36"
                fontSize="24"
                fill="white"
                textAnchor="middle"
                fontWeight="bold"
              >
                中
              </text>
            </g>

            {/* Mahjong tile 2 */}
            <g transform="translate(70, 30)">
              <rect
                x="0"
                y="0"
                width="40"
                height="56"
                rx="4"
                fill="white"
                stroke="white"
                strokeWidth="1"
              />
              {/* Bamboo/Stick symbol */}
              <text
                x="20"
                y="36"
                fontSize="24"
                fill="white"
                textAnchor="middle"
                fontWeight="bold"
              >
                發
              </text>
            </g>

            {/* Mahjong tile 3 */}
            <g transform="translate(30, 90)">
              <rect
                x="0"
                y="0"
                width="40"
                height="56"
                rx="4"
                fill="white"
                stroke="white"
                strokeWidth="1"
              />
              {/* Circle/Dot pattern */}
              <circle cx="20" cy="22" r="6" fill="white" />
              <circle cx="12" cy="38" r="6" fill="white" />
              <circle cx="28" cy="38" r="6" fill="white" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mahjong-pattern)" />
      </svg>
    </div>
  );
}
