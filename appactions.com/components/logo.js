function Logo() {
    return (
        <svg width="100%" height="100%" viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg">
            <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                <circle fill="currentColor" cx={125} cy={125} r={124.5} />
                <text fontFamily="Phosphate-Inline, Phosphate" fontSize={84} fill="#FFF">
                    <tspan x={51} y={125}>
                        {'App'}
                    </tspan>
                </text>
                <text fontFamily="Phosphate-Inline, Phosphate" fontSize={44} fill="#FFF">
                    <tspan x={41} y={172}>
                        {'Actions'}
                    </tspan>
                </text>
            </g>
        </svg>
    );
}

export default Logo;
