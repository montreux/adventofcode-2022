import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Day18BoilingBoulders from "./Day18BoilingBoulders";
import { UnstableDiffusion } from "./Day23UnstableDiffusion";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>AOC 2022</title>
        <meta
          name="description"
          content="Advent of Code 2022 by John Holcroft"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <Day18BoilingBoulders /> */}
      <UnstableDiffusion />
    </>
  );
};

export default Home;
