import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <header>
      <nav>
        <Link href="/" className="logo">
          <Image src="/icons/logo.png" alt="logo" width={28} height={28} />

          <p>
            <span className="text-purple-600">Dev</span>Event
          </p>
        </Link>

        <ul>
          <Link href="/">Home</Link>
          <Link href="/">Events</Link>
          <Link href="/event/create">Create Event</Link>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
