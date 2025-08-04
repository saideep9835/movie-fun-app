import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If logged in, check if user has favorite movie
    const checkUserMovie = async () => {
      if (status === "authenticated") {
        const res = await fetch("/api/movie");
        const data = await res.json();
        if (data.favoriteMovie) {
          router.push("/dashboard");
        } else {
          router.push("/movie");
        }
      }
    };

    checkUserMovie();
  }, [status]);

  return (
    <main style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Welcome to Movie Fun App 🎬</h1>
      <button onClick={() => signIn("google")}>Login with Google</button>
    </main>
  );
}
