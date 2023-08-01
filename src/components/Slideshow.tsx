import { AnimatePresence, Variants, motion } from 'framer-motion';
import Image, { StaticImageData } from 'next/image';
import { useEffect, useState } from 'react';
import styles from './Slideshow.module.css';

const variants: Variants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
    }
}

export default function Slideshow({ images, className = '', interval = 5000 }: { images: StaticImageData[], className?: string, interval?: number }) {
    const [index, setIndex] = useState(0);
    const [nextIndex, setNextIndex] = useState(1);

    useEffect(() => {
        const timer = setInterval(() => {
            setNextIndex((nextIndex + 1) % images.length);
            setIndex(nextIndex % images.length);
        }, interval);

        return () => clearInterval(timer);
    }, [images.length, interval, nextIndex]);

    return (
        <div className={`${styles.slideshow} ${className}`}>
            <div className={styles.slideshowImagesContainer}>
                <AnimatePresence initial={false}>
                    <motion.div
                        key={index}
                        className={styles.imageContainer}
                        variants={variants}
                        initial='hidden'
                        animate='visible'
                        exit='hidden'
                        transition={{ duration: 0.5 }}
                    >
                        <Image src={images[index]} alt="Slideshow Image" className={styles.image} />
                    </motion.div>
                    <motion.div
                        key={nextIndex}
                        className={styles.imageContainer}
                        variants={variants}
                        initial='hidden'
                        animate='visible'
                        exit='hidden'
                        transition={{ duration: 0.5 }}
                    >
                        <Image src={images[nextIndex]} alt="Slideshow Image" className={styles.image} />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};