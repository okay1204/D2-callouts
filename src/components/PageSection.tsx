import Image, { StaticImageData } from 'next/image';
import styles from './PageSection.module.css';
import React, { forwardRef, ForwardedRef } from 'react';

interface PageSectionProps {
    children?: React.ReactNode | React.ReactNode[];
    backgroundSrc: StaticImageData | string;
    includeNavHeight?: boolean;
    backgroundAlt?: string;
    bottomBorder?: boolean;
    imageClassName?: string;
}

const PageSection = forwardRef<HTMLDivElement, PageSectionProps>(
    ({ children, backgroundSrc, includeNavHeight = false, backgroundAlt = 'Background', bottomBorder = false, imageClassName = '' }, ref: ForwardedRef<HTMLDivElement>) => {
        return (
            <section className={`${styles.section} ${bottomBorder ? styles.bottomBorder : ''}`} ref={ref}>
                <Image
                    className={`${styles.sectionBackground}  ${imageClassName}`}
                    src={backgroundSrc}
                    alt={backgroundAlt}
                    fill
                    priority
                    draggable={false}
                />

                {includeNavHeight && <div className={styles.navHeight} />}

                {children}
            </section>
        );
    }
);

PageSection.displayName = 'PageSection';

export default PageSection;