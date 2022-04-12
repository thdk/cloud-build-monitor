import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>CICCD Console</title>
        <meta name="description" content="One dashboard for all your CI/CD builds" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          CICCD Console
        </h1>

        <p className={styles.description}>
          One dashboard for all your CI/CD builds
        </p>

        <div className={styles.grid}>
          <Link href="/builds">
            <a className={styles.card}>
              <h2>Builds &rarr;</h2>
              <p>Go to your dashboard and start monitoring your CI/CD builds.</p>
            </a>
          </Link>
          <Link href="/repos">
            <a className={styles.card}>
              <h2>Repos &rarr;</h2>
              <p>See what is happening in your source repositories.</p>
            </a>
          </Link>
          <Link href="/config/builds">
            <a className={styles.card}>
              <h2>Config &rarr;</h2>
              <p>Customise your ciccd experience.</p>
            </a>
          </Link>
          <a
            href="https://github.com/thdk/cloud-build-monitor"
            className={styles.card}
          >
            <h2>Contribute &rarr;</h2>
            <p>
              CICCD is open source. Submit an issue or open a PR on github.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/thdk"
          target="_blank"
          rel="noopener noreferrer"
        >
          Made by{' '}
          <span className={styles.logo}>
            thdk
          </span>
        </a>
      </footer>
    </div>
  )
}

export default Home
