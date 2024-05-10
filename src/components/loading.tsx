import styles from './Loading.module.css'

export default function Loading() {
    return (
        <main>
            <div className={styles.loadingSpinner} />
        </main>
    )
}