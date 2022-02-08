function Logo({ stroke = '#fff', strokeWidth = 3 }) {
    return (
        <svg width="100%" height="100%" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 11h30l-7 9.5-16-19L2 11z" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
        </svg>
    );
}

export default Logo;
