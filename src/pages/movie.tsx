import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Movie() {
  const [movie, setMovie] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubmit = async () => {
    await fetch("/api/movie", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ movie }),
    });
    router.push("/dashboard");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Welcome, {session?.user?.name}!</h2>
      <p>What is your favorite movie?</p>
      <input
        type="text"
        value={movie}
        onChange={(e) => setMovie(e.target.value)}
        placeholder="e.g., Inception"
      />
      <br />
      <button onClick={handleSubmit} style={{ marginTop: "20px" }}>
        Save & Continue
      </button>
    </div>
  );
}
