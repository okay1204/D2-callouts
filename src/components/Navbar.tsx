'use client'

import SavedSetsButtonBorder from '@/images/icons/saved-sets-button-border.svg'
import Logo from '@/images/logo.png'
import { Activity, CalloutSet } from '@/utils/callouts/calloutSets'
import { faHome, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import styles from './Navbar.module.css'

interface SearchResult {
    activity: Activity
    calloutSetId: string
    calloutSetName: string
}

export default function Navbar({calloutSets}: {calloutSets: CalloutSet[]}) {
    const [searchText, setSearchText] = useState('')
    const [searchResults, setSearchResults] = useState<SearchResult[]>([])
    const [searchBarFocused, setSearchBarFocused] = useState(false)
    const [isHoveringSearchResults, setIsHoveringSearchResults] = useState(false)

    function handleSearchTyping(newSearchText: string) {
        setSearchText(newSearchText)

        if (newSearchText === '') {
            setSearchResults([])
            return
        }

        // Filter activities based on search text
        const searchResults: SearchResult[] = []

        for (const calloutSet of calloutSets) {
            const filteredActivities = calloutSet.activities.filter(activity => activity.name.toLowerCase().includes(newSearchText.toLowerCase().trim()))

            for (const activity of filteredActivities) {
                searchResults.push({
                    activity,
                    calloutSetId: calloutSet.id,
                    calloutSetName: calloutSet.name,
                })
            }
        }

        setSearchResults(searchResults)
    }

    const handleSearchResultClick = () => {
        setSearchBarFocused(false)
        setSearchText('')
        setSearchResults([])
    }

    const searchBar = (main: boolean) => (
        <div className={`${styles.searchBar} ${main ? styles.searchBar1 : styles.searchBar2}`}>
            <div className={`${styles.searchBarAbsolute} ${searchBarFocused ? styles.searchBarFocused: ''}`}>
                <div className={styles.searchInputArea}>
                    <FontAwesomeIcon className={styles.searchIcon} icon={faMagnifyingGlass} />
                    <input
                        type="text"
                        className={styles.searchBarText}
                        placeholder="Activity Search"
                        value={searchText}
                        onChange={e => handleSearchTyping(e.target.value)}
                        onFocus={() => setSearchBarFocused(true)}
                        onBlur={() => !isHoveringSearchResults && setSearchBarFocused(false)}
                    />
                </div>
                <div
                    className={styles.searchResultList}
                    onMouseEnter={() => setIsHoveringSearchResults(true)}
                    onMouseLeave={() => setIsHoveringSearchResults(false)}
                    onClick={handleSearchResultClick}
                >
                    {searchBarFocused && searchResults.map(result => (
                        <Link href={`/callout/${result.calloutSetId}?activity=${result.activity.id}`} key={result.activity.id} className={styles.searchResult}>
                            <div className={styles.searchResultText}>
                                <span className={styles.searchResultName}>{result.activity.name}</span>
                                <span className={styles.searchResultSet}>{result.calloutSetName}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )

    return (
        <nav className={styles.nav}>
            <div className={styles.topRow}>
                <Link href="/" className={styles.homeButton}>
                    <FontAwesomeIcon className={styles.homeIcon} icon={faHome} />
                </Link>
                {searchBar(true)}
                <Link href="/" className={styles.savedSetsButton}>
                    <Image
                        src={SavedSetsButtonBorder}
                        className={styles.savedSetsButtonBorder}
                        alt=''
                    />
                    <Image
                        src={Logo}
                        className={styles.logo}
                        alt="D2 Callouts Logo"
                    />
                </Link>
            </div>
            <div className={styles.bottomRow}>
                {searchBar(false)}
            </div>
        </nav>
    )
}