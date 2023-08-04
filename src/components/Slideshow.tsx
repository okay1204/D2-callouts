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

const transitionTime = 1;
export default function Slideshow({ images, className = '', interval = 8000 }: { images: StaticImageData[], className?: string, interval?: number }) {
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
            {/* This is used to preload the images on the slideshow before they are shown, and will never be actually displayed */}
            <div className="hide">
                {images.map((image, i) => (
                    <Image
                        key={i}
                        src={image}
                        priority={true}
                        alt="Slideshow Image"
                    />
                ))}
            </div>
            <div className={styles.slideshowImagesContainer}>
                <AnimatePresence initial={false}>
                    <motion.div
                        key={index}
                        className={styles.imageContainer}
                        variants={variants}
                        initial='hidden'
                        animate='visible'
                        exit='hidden'
                        transition={{ duration: transitionTime }}
                    >
                        <Image
                            src={images[index]}
                            alt="Slideshow Image"
                            className={styles.image} 
                        />
                    </motion.div>
                    <motion.div
                        key={nextIndex}
                        className={styles.imageContainer}
                        variants={variants}
                        initial='hidden'
                        animate='visible'
                        exit='hidden'
                        transition={{ duration: transitionTime }}
                    >
                        <Image
                            src={images[nextIndex]}
                            alt="Slideshow Image"
                            className={styles.image}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};