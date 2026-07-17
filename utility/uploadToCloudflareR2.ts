async function uploadToR2(file: File, key: string) {
  const res = await fetch("/api/upload/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, contentType: file.type }),
  });

  const { putUrl, publicUrl } = await res.json();

  await fetch(putUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  return publicUrl;
}

export default uploadToR2;
