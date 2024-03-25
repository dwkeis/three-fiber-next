import Link from 'next/link'

const SideBar = () => {

  return (
    <>
      <div class="flex gap:8">
        <Link href="/member" >To Member</Link>
        <Link href="/memberCoin" >To MemberCoin</Link>
        <Link href="/voting" >To VotingBox</Link>
      </div>
    </>
  );
};

export default SideBar;