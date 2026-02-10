export async function postFormData(endpoint, data) {
  const baseUrl = localStorage.getItem("client_base_url");
  if (!baseUrl) throw new Error("Client base URL missing");

  const form = new URLSearchParams();
  Object.keys(data).forEach(k => form.append(k, data[k]));

  const res = await fetch(baseUrl + endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString()
  });

  if (!res.ok) throw new Error("Network error");
  return res.json();
}
