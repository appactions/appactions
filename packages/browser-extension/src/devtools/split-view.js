import { useState, useRef } from 'react';

export default function SplitView({ left, right, minimumSize = 150 }) {
    const [isResizing, setIsResizing] = useState(false);
    const [leftWidthPercent, setLeftWidthPercent] = useState(25);
    const wrapperElementRef = useRef(null);

    const onResizeStart = () => setIsResizing(true);
    let onResize;
    let onResizeEnd;
    if (isResizing) {
        onResizeEnd = () => setIsResizing(false);

        onResize = event => {
            if (!isResizing || wrapperElementRef.current === null) {
                return;
            }

            event.preventDefault();

            const { height, width, left, top } = wrapperElementRef.current.getBoundingClientRect();

            const currentMousePosition = event.clientX - left;

            const boundaryMin = minimumSize;
            const boundaryMax = width - minimumSize;

            const isMousePositionInBounds = currentMousePosition > boundaryMin && currentMousePosition < boundaryMax;

            if (isMousePositionInBounds) {
                const percentage = (currentMousePosition / width) * 100;

                setLeftWidthPercent(percentage);
            }
        };
    }

    return (
        <div
            className="relative flex flex-row w-full h-full"
            onMouseMove={onResize}
            onMouseLeave={onResizeEnd}
            onMouseUp={onResizeEnd}
            ref={wrapperElementRef}
        >
            <div className="overflow-x-hidden overflow-y-scroll" style={{ width: `${leftWidthPercent}%` }}>
                {left}
            </div>
            <div
                onMouseDown={onResizeStart}
                style={{ left: `${leftWidthPercent}%`, cursor: 'ew-resize' }}
                className="absolute w-1 h-full border-l border-gray-200 border-solid cursor-move -left-0.5"
            ></div>
            <div className="overflow-x-hidden overflow-y-scroll" style={{ width: `${100 - leftWidthPercent}%` }}>
                {right}
            </div>
        </div>
    );
}
