
'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { SelectEventType } from './steps/SelectEventType';
import { AddItemsStep } from './steps/AddItemsStep';
import { AdditionalDetailsStep } from './steps/AdditionalDetailsStep';

interface Step {
    label: string;
    component: React.ReactNode;
    isNextDisabled?: boolean;
}
export default function StepperComponent() {
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const [eventTypeSelected, setEventTypeSelected] = React.useState(false);

    const steps: Step[] = [
        {
            label: 'Escoge el tipo de evento',
            component: (
                <SelectEventType onSelect={(isSelected: boolean) => setEventTypeSelected(isSelected)} />
            ),
            isNextDisabled: !eventTypeSelected,
        },
        {
            label: 'Añadir artículos y guardar borrador',
            component: <AddItemsStep />,
        },
        {
            label: 'Introduce datos adicionales',
            component: <AdditionalDetailsStep />,
        },
    ];

    const maxSteps = steps.length;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <Box sx={{ maxWidth: 600, flexGrow: 1 }}>
            <Paper
                square
                elevation={0}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    height: 50,
                    pl: 2,
                    bgcolor: 'background.default',
                }}
            >
                <Typography>{steps[activeStep].label}</Typography>
            </Paper>
            <Box sx={{ height: 255, maxWidth: 600, width: '100%', p: 2 }}>
                {steps[activeStep].component}
            </Box>
            <MobileStepper
                variant="text"
                steps={maxSteps}
                position="static"
                activeStep={activeStep}
                nextButton={
                    <Button
                        size="small"
                        onClick={handleNext}
                        disabled={activeStep === maxSteps - 1 || steps[activeStep]?.isNextDisabled}
                    >
                        Siguiente
                        {theme.direction === 'rtl' ? (
                            <KeyboardArrowLeft />
                        ) : (
                            <KeyboardArrowRight />
                        )}
                    </Button>
                }
                backButton={
                    <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                        {theme.direction === 'rtl' ? (
                            <KeyboardArrowRight />
                        ) : (
                            <KeyboardArrowLeft />
                        )}
                        Anterior
                    </Button>
                }
            />
        </Box>
    );
}