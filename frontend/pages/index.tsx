import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Scholar from './Scholar'

const Home: NextPage = () => {
  return (
    <div>
      <Scholar />
    </div>
  )
}

export default Home
