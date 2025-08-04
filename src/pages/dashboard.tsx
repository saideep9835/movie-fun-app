import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [fact, setFact] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status]);

  useEffect(() => {
    const fetchFact = async () => {
      const res = await fetch("/api/fun-fact");
      const data = await res.json();
      setFact(data.fact);
    };

    if (status === "authenticated") {
      fetchFact();
    }
  }, [status]);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div style={{ textAlign: "center", marginTop: "60px" }}>
      <h1>Welcome, {session?.user?.name} 🎬</h1>
      <p>Email: {session?.user?.email}</p>
      <img
        src={session?.user?.image || ""}
        alt="User"
        width={100}
        style={{ borderRadius: "50%" }}
      />
      <h2 style={{ marginTop: "30px" }}>Fun Fact About Your Favorite Movie:</h2>
      <p style={{ fontStyle: "italic" }}>{fact || "Fetching..."}</p>
      <button style={{ marginTop: "30px" }} onClick={() => signOut()}>
        Logout
      </button>
    </div>
  );
}
