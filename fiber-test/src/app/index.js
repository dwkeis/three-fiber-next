import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from 'next/link'

const Home = () => {
  const router = useRouter();
  const [showItems, setShowItems] = useState({});

  useEffect(() => {

  }, []);

  return (
    <>
      <Link href="/member">Member</Link>
    </>
  );
};

export default Home;
