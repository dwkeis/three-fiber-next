import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from 'next/link'
import '@master/css'
import SideBar from '@/components/sidebar';

const Home = () => {
  const router = useRouter();
  const [showItems, setShowItems] = useState({});

  useEffect(() => {

  }, []);

  return (
    <>
      <SideBar />
      <div class='f:28 f:bold mt:24'>
        <span>It's a showcase page of three-fiber</span><br />
        <span>Please select a page above to check the result.</span>
      </div>
    </>
  );
};

export default Home;
