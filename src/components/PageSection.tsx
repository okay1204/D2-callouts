import Image, { StaticImageData } from 'next/image';
import styles from './PageSection.module.css';
import React, { forwardRef, ForwardedRef } from 'react';

interface PageSectionProps {
    children?: React.ReactNode | React.ReactNode[];
    backgroundSrc: StaticImageData;
    backgroundAlt?: string;
    bottomBorder?: boolean;
}

const PageSection = forwardRef<HTMLDivElement, PageSectionProps>(
    ({ children, backgroundSrc, backgroundAlt = 'Background', bottomBorder = false }, ref: ForwardedRef<HTMLDivElement>) => {
        return (
            <section className={`${styles.section} ${bottomBorder ? styles.bottomBorder : ''}`} ref={ref}>
                <Image
                    className={styles.sectionBackground}
                    src={backgroundSrc}
                    alt={backgroundAlt}
                    fill={true}
                    priority={true}
                    draggable={false}
                />

                {children}
            </section>
        );
    }
);

PageSection.displayName = 'PageSection';

export default PageSection;