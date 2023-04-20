import { AnimatePresence, Transition, Variants, motion } from 'framer-motion';
import { useState } from 'react';

const getStatus = (step: number, currentStep: number) => {
  switch (true) {
    case step < currentStep:
      return 'checked';
    case step === currentStep:
      return 'current';
    default:
      return 'inactive';
  }
};

function Stepper({ step, currentStep }: { step: number; currentStep: number }) {
  const status = getStatus(step, currentStep);

  const checkmarkVariants: Variants = {
    hide: {
      pathLength: 0,
    },
    show: {
      pathLength: 1,
    },
  };

  const stepperVariants: Variants = {
    inactive: {
      backgroundColor: '#f1f1f1',
      borderColor: '#e0e0e0',
      color: '#e0e0e0',
    },
    current: {
      backgroundColor: '#f1f1f1',
      borderColor: '#2563eb',
      color: '#2563eb',
    },
    checked: {
      backgroundColor: '#2563eb',
      borderColor: '#2563eb',
      color: 'transparent',
    },
  };

  const checkmarkTransition: Transition = {
    duration: 0.3,
    delay: 0.15,
    ease: 'easeOut',
    type: 'tween',
  };

  return (
    <motion.div
      className="w-8 h-8 rounded-full border-2 border-blue-600 text-blue-600 font-semibold flex items-center justify-center relative"
      variants={stepperVariants}
      animate={status}
    >
      <span>{step + 1}</span>
      <AnimatePresence>
        {step < currentStep && (
          <div className="absolute w-full h-full top-0 left-0 flex items-center justify-center text-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <motion.path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
                variants={checkmarkVariants}
                initial={'hide'}
                animate={'show'}
                transition={checkmarkTransition}
              />
            </svg>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function StepperPage() {
  const [step, setStep] = useState(0);

  const numberOfSteps = 4;

  const onChangeStep = (direction: -1 | 1) => {
    if (direction === -1 && step === 0) return;
    if (direction === 1 && step === numberOfSteps) return;

    setStep(step + direction);
  };

  return (
    <main className="flex flex-col gap-8 items-center justify-center min-h-screen">
      <h1>Stepper</h1>
      <div className="flex flex-col gap-8 p-8 rounded bg-gray-100 text-black w-96">
        <div className="flex gap-4 mx-auto">
          {[...Array(numberOfSteps)].map((_, i) => (
            <Stepper key={i} step={i} currentStep={step} />
          ))}
        </div>
        <div className="flex justify-between">
          <button onClick={() => onChangeStep(-1)} className="px-4 py-1">
            previous
          </button>
          <button onClick={() => onChangeStep(1)} className="border rounded px-4 py-1 bg-blue-600 text-gray-100">
            next
          </button>
        </div>
      </div>
    </main>
  );
}
