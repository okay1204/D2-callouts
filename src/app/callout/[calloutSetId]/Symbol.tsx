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
    onLoadingComplete: () => void
    name: string
    onNameChange: (ChangeEvent: ChangeEvent<HTMLTextAreaElement>) => void
    restoreDefaultsClicked: boolean
}

const maxRows = 2;
const textareaLineHeight = 30;
export default function Symbol({ imageReference, selectorClassName, inEditMode, setInEditMode, onLoadingComplete, name, onNameChange, restoreDefaultsClicked }: SymbolProps) {
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

    // Write an updaterows function that will make the textarea grow as the user types, but only to a max of 2 rows. Make sure to use the state setter function to update the rows state variable.
    const updateRows = () => {
        if (inputRef.current != null) {
            const previousRows = inputRef.current.rows;
            inputRef.current.rows = 1; // Reset the number of rows in the textarea
            const currentRows = ~~(inputRef.current.scrollHeight / textareaLineHeight);

            if (currentRows === previousRows) {
                inputRef.current.rows = currentRows;
            }

            if (currentRows >= maxRows) {
                inputRef.current.rows = maxRows;
                inputRef.current.scrollTop = inputRef.current.scrollHeight;
            }

            setRows(currentRows < maxRows ? currentRows : maxRows);
        }
    }

    useEffect(() => {
        updateRows();
    }, [name]);

    return (
        <div
            key={imageReference.id}
            className={`${styles.symbol} ${selectorClassName} ${inEditMode ? styles.symbolEditMode : ''}`}
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

            <textarea
                className={styles.symbolName}
                disabled={!inEditMode}
                ref={inputRef}
                // If originalName is defined, that means the text was temporarily cleared to allow the user to edit the name. If they click out without changing the name, we want to restore the original name.
                value={originalName == undefined ? name : ''}
                onBlur={() => clearOriginalName()}
                rows={rows}
                onChange={e => {
                    onNameChange(e);
                    clearOriginalName();
                    updateRows();
                }}
                style={{
                    color: restoreDefaultsClicked ? 'white' : 'rgba(235, 235, 235, 0.8)',
                    overflowY: rows === maxRows ? 'scroll' : 'hidden'
                }}
            />
        </div>
    )
}