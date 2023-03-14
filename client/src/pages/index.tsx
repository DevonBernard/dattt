import Head from 'next/head'
import styles from 'dattt/styles/Home.module.css'


export default function Home() {
  return (
    <>
      <Head>
        <title>DATTT</title>
        <meta name="description" content="Decentralized autonomous task manager" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
      </main>
    </>
  )
}
