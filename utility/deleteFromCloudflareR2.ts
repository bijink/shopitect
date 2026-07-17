async function deleteFromR2(key: string) {
  const res = await fetch("/api/upload/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key }),
  });

  if (!res.ok) {
    throw new Error("Failed to delete object from R2");
  }
}

export default deleteFromR2;
