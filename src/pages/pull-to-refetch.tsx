import { DraggableProps, motion, useTransform, useAnimation, useSpring, Variants, DragElastic } from 'framer-motion';
import { useState } from 'react';

export default function PullToRefetchPage() {
  const scrollY = useSpring(0, { stiffness: 500, damping: 50 }); // spring with stiffness and damping and our base value on which we will apply transforms

  const opacity = useTransform(scrollY, [0, 30], [0, 1]); // opacity will be 0 when scrollY is 0 and 1 when scrollY is 30
  const loaderY = useTransform(scrollY, [0, 30], [-48, 0]); // loaderY will be 0 when scrollY is 0 and -48 when scrollY is 30

  const dragConstraints: DraggableProps['dragConstraints'] = {
    // dragConstraints for respecting the boundaries of the parent
    top: 0,
    bottom: 0,
  };

  const dragElastic: DragElastic = {
    // dragElastic for elastic effect when we drag the element. It's set by default to every direction, but we don't want it to be elastic to the top
    bottom: 0.15,
  };

  const loadingAnimation = useAnimation(); // animation handler for the loader spinner

  const animationVariants: Variants = {
    // set of animation variants for the loader spinner
    startLoading: {
      rotate: 360,
      transition: {
        repeat: Infinity,
        ease: 'linear',
        duration: 1,
      },
    },
    endLoading: {
      rotate: 0,
    },
  };

  const [randomMemeIndex, setRandomMemeIndex] = useState(0);
  const memes = [
    'https://i.redd.it/254twe19ewra1.jpg',
    'https://i.redd.it/yujh8gzbcypa1.png',
    'https://i.redd.it/i1zsudixvipa1.jpg',
  ];

  const onDragEnd = () => {
    const y = scrollY.get();

    if (y >= 30) {
      scrollY.set(30);
      scrollY.stop();
      loadingAnimation.start('startLoading');

      setTimeout(() => {
        setRandomMemeIndex((prev) => (prev + 1) % memes.length);
        loadingAnimation.start('endLoading');
        scrollY.set(0);
      }, 2000);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-cebter p-24 bg-gray-800">
      <h1 className="text-4xl font-bold mb-8">Pull to refetch</h1>
      <motion.div className="w-96 h-[700px] border-[12px] border-black text-black rounded-[32px] bg-gray-200 p-2 overflow-hidden relative">
        <motion.span
          className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center absolute top-4 mx-auto left-0 right-0"
          style={{
            opacity,
            y: loaderY,
          }}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-5 h-5"
            variants={animationVariants}
            animate={loadingAnimation}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </motion.svg>
        </motion.span>
        <motion.div
          className="flex flex-col items-center gap-4 py-4 min-h-full"
          style={{
            y: scrollY, // apply the scrollY transform to the y property, this way we can control it two ways: by dragging and by setting/editing the value
          }}
          drag="y"
          dragConstraints={dragConstraints}
          dragElastic={dragElastic}
          onDragEnd={onDragEnd}
        >
          <motion.h2>Pull to refetch another meme</motion.h2>
          <motion.img
            className="max-w-full max-h-[75%] object-contain"
            src={memes[randomMemeIndex]}
            draggable={false}
          />
        </motion.div>
      </motion.div>
    </main>
  );
}
