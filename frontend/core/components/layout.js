import Header from "./header"
import Head from 'next/head'

const DefaultLayout = props => {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <Header />
      {props.children}
    </>
  )
}

export default DefaultLayout