import { m } from 'framer-motion';
import { useState, useEffect } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Box, { BoxProps } from '@mui/material/Box';
//
import NextesyLogo from '../../nextesy-logo-new/nextesy-logo';

// ----------------------------------------------------------------------

export default function SplashScreen({ sx, ...other }: BoxProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <Box
            sx={{
                px: 5,
                width: 1,
                flexGrow: 1,
                minHeight: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...sx,
            }}
            {...other}
            data-testid="splash-screen"
        >
            <>
                <m.div
                    animate={{
                        scale: [1, 0.9, 0.9, 1, 1],
                        opacity: [1, 0.48, 0.48, 1, 1],
                    }}
                    transition={{
                        duration: 2,
                        ease: 'easeInOut',
                        repeatDelay: 1,
                        repeat: Infinity,
                    }}
                >
                    <NextesyLogo
                        disabledLink
                        sx={{ width: '4.5rem', height: '1.75rem' }}
                    />
                </m.div>

                <Box
                    component={m.div}
                    animate={{
                        scale: [1.6, 1, 1, 1.6, 1.6],
                        rotate: [270, 0, 0, 270, 270],
                        opacity: [0.25, 1, 1, 1, 0.25],
                        borderRadius: ['25%', '25%', '50%', '50%', '25%'],
                    }}
                    transition={{
                        ease: 'linear',
                        duration: 3.2,
                        repeat: Infinity,
                    }}
                    sx={{
                        width: 100,
                        height: 100,
                        position: 'absolute',
                        border: (theme) =>
                            `solid 3px ${alpha(
                                theme.palette.primary[60],
                                0.24,
                            )}`,
                    }}
                />

                <Box
                    component={m.div}
                    animate={{
                        scale: [1, 1.2, 1.2, 1, 1],
                        rotate: [0, 270, 270, 0, 0],
                        opacity: [1, 0.25, 0.25, 0.25, 1],
                        borderRadius: ['25%', '25%', '50%', '50%', '25%'],
                    }}
                    transition={{
                        ease: 'linear',
                        duration: 3.2,
                        repeat: Infinity,
                    }}
                    sx={{
                        width: 120,
                        height: 120,
                        position: 'absolute',
                        border: (theme) =>
                            `solid 8px ${alpha(
                                theme.palette.primary[60],
                                0.24,
                            )}`,
                    }}
                />
            </>
        </Box>
    );
}
