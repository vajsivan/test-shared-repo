import { ColumnPinningState } from '@tanstack/react-table';
import { useCallback, useState } from 'react';
import { usePropsGracefully } from 'src/hooks';

export const useColumnPinning = (
    columnPinningConfig: ColumnPinningState = { right: ['actions'] },
) => {
    const [columnPinning, setColumnPinning] =
        useState<ColumnPinningState>(columnPinningConfig);

    const columnPinningConfigRef = usePropsGracefully(columnPinningConfig);

    // we must wrap refCallback with useCallback to avoid unnecessary re-renders
    const tableRefCallback = useCallback(
        (element: HTMLDivElement | null) => {
            const checkScroll = () => {
                if (!element) return;

                const hasHorizontalScroll =
                    element.scrollWidth > element.clientWidth;

                setColumnPinning(
                    hasHorizontalScroll ? columnPinningConfigRef.current : {},
                );
            };

            const observer = new ResizeObserver(checkScroll);

            // React will call your ref callback with the DOM node when it’s time to set the ref,
            // and with null when it’s time to clear it
            // Note: In React v19 else statement is omitted and the cleanup function is called instead(like in useEffect).
            if (element) {
                // Initial check
                checkScroll();

                // Setup resize observer
                observer.observe(element);
            } else {
                // Cleanup observer
                observer.disconnect();
            }
        },
        [columnPinningConfigRef],
    );

    return { columnPinning, setColumnPinning, tableRefCallback };
};
