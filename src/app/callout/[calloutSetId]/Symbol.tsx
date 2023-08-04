'use client'

import { ImageReference } from "@/utils/callouts/calloutSets";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import styles from './Symbol.module.css';

interface SymbolProps {
    imageReference: ImageReference
    inEditMode: boolean
    setInEditMode: (inEditMode: boolean) => void
    onLoadingComplete: () => void
    name: string
    onNameChange: (ChangeEvent: ChangeEvent<HTMLInputElement>) => void
    restoreDefaultsClicked: boolean
}

export default function Symbol({imageReference, inEditMode, setInEditMode, onLoadingComplete, name, onNameChange, restoreDefaultsClicked}: SymbolProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [wasClicked, setWasClicked] = useState<boolean>(false);
    const [originalName, setOriginalName] = useState<string | undefined>(undefined);

    // If the component is clicked, focus the input element
    useEffect(() => {
        if (wasClicked) {
            inputRef.current?.focus();
            setWasClicked(false);
        }
    }, [wasClicked]);

    const clearOriginalName = () => {
        originalName != undefined && setOriginalName(undefined);
    }

    return (
        <div
            key={imageReference.id}
            className={`${styles.symbol} ${inEditMode ? styles.symbolEditMode : ''}`}
            onClick={() => {
                setInEditMode(true);
                setWasClicked(true);
                setOriginalName(name);
            }}
        >
            <div className={styles.symbolImageContainer}>
                <Image
                    fill={true}
                    priority={true}
                    onLoadingComplete={onLoadingComplete}
                    sizes="6rem, (max-width: 750px) 5rem"
                    className={styles.symbolImage}
                    src={imageReference.url}
                    alt='Callout Set Symbol'
                />
            </div>

            <input
                type="text"
                className={styles.symbolName}
                disabled={!inEditMode}
                ref={inputRef}
                // If originalName is defined, that means the text was temporarily cleared to allow the user to edit the name. If they click out without changing the name, we want to restore the original name.
                value={originalName == undefined ? name : ''}
                onBlur={() => clearOriginalName()}
                onChange={e => {
                    onNameChange(e);
                    clearOriginalName()
                }}
                style={{color: restoreDefaultsClicked ? 'white' : 'rgba(235, 235, 235, 0.8)'}}
            />
        </div>
    )
}