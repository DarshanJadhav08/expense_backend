async function addExpense() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE_URL}/expense`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      title: document.getElementById("title").value,
      amount: document.getElementById("amount").value
    })
  });

  const data = await res.json();
  alert(data.message || "Expense added");
}
