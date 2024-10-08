'use client'

import { ImageReference } from "@/utils/callouts/calloutSets";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import styles from './Symbol.module.css';

interface SymbolProps {
    imageReference: ImageReference
    selectorClassName: string
    inEditMode: boolean
    setInEditMode: (inEditMode: boolean) => void
    onLoad: () => void
    name: string
    onNameChange: (ChangeEvent: ChangeEvent<HTMLTextAreaElement>) => void
    restoreDefaultsClicked: boolean
}

const maxRows = 2;
export default function Symbol({imageReference, selectorClassName, inEditMode, setInEditMode, onLoad: onLoad, name, onNameChange, restoreDefaultsClicked}: SymbolProps) {
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [wasClicked, setWasClicked] = useState<boolean>(false);
    const [originalName, setOriginalName] = useState<string | undefined>(undefined);
    const [rows, setRows] = useState<number>(1);

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

    // Set the number of rows in the textarea to match the number of lines of text with a maximum of 2 rows
    const adjustRows = () => {
        if (inputRef.current != null) {
            const input = inputRef.current;
            const previousRows = input.rows;
            input.rows = 1; // reset number of rows in textarea
            const currentRows = ~~(input.scrollHeight / 28);
            if (currentRows === previousRows) {
                input.rows = currentRows;
            }
            if (currentRows >= maxRows) {
                input.rows = maxRows;
            }
            setRows(currentRows < maxRows ? 1 : maxRows);
        }
    }

    const handleNameSelect = () => {
        setInEditMode(true);
        setOriginalName(name);
    }

    // Adjust rows whenever the name changes
    useEffect(() => {
        adjustRows();
    }, [name]);

    return (
        <div
            key={imageReference.id}
            className={`${styles.symbol} ${selectorClassName} ${inEditMode ? styles.editMode : ''}`}
            onClick={() => {
                handleNameSelect();
                setWasClicked(true);
            }}
        >
            <div className={styles.symbolImageContainer}>
                <Image
                    fill
                    priority
                    onLoad={onLoad}
                    sizes="6rem, (max-width: 750px) 5rem"
                    className={styles.symbolImage}
                    src={imageReference.url}
                    alt='Callout Set Symbol'
                />
            </div>

            <textarea
                className={`${styles.symbolName} ${inEditMode ? styles.editMode : ''}`}
                ref={inputRef}
                rows={rows}
                // If originalName is defined, that means the text was temporarily cleared to allow the user to edit the name. If they click out without changing the name, we want to restore the original name.
                value={originalName == undefined ? name : ''}
                onBlur={() => clearOriginalName()}
                onFocus={() => handleNameSelect()}
                onChange={e => {
                    onNameChange(e);
                    clearOriginalName();
                }}
                style={{color: restoreDefaultsClicked ? 'white' : 'rgba(235, 235, 235, 0.8)'}}
            />
        </div>
    )
}