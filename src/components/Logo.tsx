import React from 'react';

export const Logo = () => {
    return (
        <svg
            width="60"
            height="34"
            viewBox="0 0 60 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="logo-icon"
            aria-hidden="true"
        >
            <defs>
                <linearGradient id="logoGradient" x1="0" y1="0" x2="60" y2="34" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#22d3ee" /> {/* Brighter Cyan */}
                    <stop offset="50%" stopColor="#a78bfa" /> {/* Brighter Purple */}
                    <stop offset="100%" stopColor="#f472b6" /> {/* Brighter Pink */}
                </linearGradient>

                <filter id="packetGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>

                <style>{`
          .node { animation: pulse 3s infinite ease-in-out; }
          .packet-visible { fill: white; filter: url(#packetGlow); }
          
          @keyframes pulse {
            0%, 100% { r: 3; opacity: 1; stroke-width: 0; }
            50% { r: 4; opacity: 0.8; stroke-width: 1px; stroke: rgba(255,255,255,0.3); }
          }
        `}</style>
            </defs>

            {/* V Shape - Narrowed (Width ~18) */}
            <path
                d="M6 6 L15 28 L24 6"
                stroke="url(#logoGradient)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity="0.9"
            />

            {/* Moving Packets on V - Big and Glowing */}
            <circle r="2.5" className="packet-visible">
                <animateMotion
                    dur="3s"
                    repeatCount="indefinite"
                    path="M6 6 L15 28 L24 6"
                    keyPoints="0;0.5;1"
                    keyTimes="0;0.5;1"
                    calcMode="linear"
                />
            </circle>
            <circle r="1.5" className="packet-visible" opacity="0.6">
                <animateMotion
                    dur="3s"
                    repeatCount="indefinite"
                    path="M6 6 L15 28 L24 6"
                    begin="0.15s"
                />
            </circle>

            {/* Nodes V */}
            <circle cx="6" cy="6" r="3" fill="#22d3ee" className="node" style={{ animationDelay: '0s' }} />
            <circle cx="15" cy="28" r="3" fill="#6366f1" className="node" style={{ animationDelay: '1s' }} />
            <circle cx="24" cy="6" r="3" fill="#a78bfa" className="node" style={{ animationDelay: '2s' }} />

            {/* B Shape - Widened (Width ~18) */}
            {/* Start x=32 */}
            <path
                d="M32 6 L32 28"
                stroke="url(#logoGradient)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeOpacity="0.9"
            />
            <path
                d="M32 6 H40 C46 6 46 15 40 15 H32 H42 C49 15 49 28 42 28 H32"
                stroke="url(#logoGradient)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                strokeOpacity="0.9"
            />

            {/* Moving Packets on B - Big and Glowing */}
            <circle r="2.5" className="packet-visible">
                <animateMotion
                    dur="4s"
                    repeatCount="indefinite"
                    path="M32 6 H40 C46 6 46 15 40 15 H32 H42 C49 15 49 28 42 28 H32"
                />
            </circle>
            <circle r="1.5" className="packet-visible" opacity="0.6">
                <animateMotion
                    dur="4s"
                    repeatCount="indefinite"
                    path="M32 6 H40 C46 6 46 15 40 15 H32 H42 C49 15 49 28 42 28 H32"
                    begin="0.15s"
                />
            </circle>

            {/* Nodes B */}
            <circle cx="32" cy="6" r="3" fill="#a78bfa" className="node" style={{ animationDelay: '0.5s' }} />
            <circle cx="32" cy="17" r="3" fill="#c026d3" className="node" style={{ animationDelay: '1.5s' }} />
            <circle cx="32" cy="28" r="3" fill="#e879f9" className="node" style={{ animationDelay: '2.5s' }} />

        </svg>
    );
};
