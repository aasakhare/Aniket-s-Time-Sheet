let entries = JSON.parse(localStorage.getItem("timesheetEntries")) || [];

function showEntryForm() {
  document.getElementById("entrySection").classList.remove("hidden");
  document.getElementById("dateSection").classList.add("hidden");
}

function showDateView() {
  document.getElementById("dateSection").classList.remove("hidden");
  document.getElementById("entrySection").classList.add("hidden");
}

function addEntry() {
  const date = document.getElementById("date").value;
  const task = document.getElementById("task").value;
  const start = document.getElementById("start").value;
  const end = document.getElementById("end").value;

  if (!date || !task || !start || !end) {
    alert("Please fill all fields");
    return;
  }

  const hours =
    (new Date(`1970-01-01T${end}`) - new Date(`1970-01-01T${start}`)) / 3600000;

  if (hours <= 0) {
    alert("Invalid time range");
    return;
  }

  entries.push({ date, task, start, end, hours });
  localStorage.setItem("timesheetEntries", JSON.stringify(entries));

  updateDashboard();
  alert("Entry saved");
}

function filterByDate() {
  const selectedDate = document.getElementById("filterDate").value;
  const container = document.getElementById("entries");
  container.innerHTML = "";

  let dailyTotal = 0;

  entries
    .filter(e => e.date === selectedDate)
    .forEach(e => {
      dailyTotal += e.hours;
      container.innerHTML += `
        <div>
          <strong>${e.task}</strong><br>
          ${e.start} – ${e.end} (${e.hours.toFixed(2)} hrs)
        </div>`;
    });

  if (selectedDate) {
    container.innerHTML += `
      <div><strong>Total for day: ${dailyTotal.toFixed(2)} hrs</strong></div>`;
  }
}

function updateDashboard() {
  let total = 0, month = 0, year = 0;
  const now = new Date();

  entries.forEach(e => {
    total += e.hours;
    const d = new Date(e.date);

    if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear())
      month += e.hours;

    if (d.getFullYear() === now.getFullYear())
      year += e.hours;
  });

  document.getElementById("totalHours").innerText = total.toFixed(2);
  document.getElementById("monthHours").innerText = month.toFixed(2);
  document.getElementById("yearHours").innerText = year.toFixed(2);
}

window.onload = updateDashboard;
