let records = JSON.parse(localStorage.getItem("timesheet")) || [];

function addEntry() {
  console.log("Add Entry clicked"); // DEBUG LINE

  const date = document.getElementById("date").value;
  const task = document.getElementById("task").value;
  const start = document.getElementById("start").value;
  const end = document.getElementById("end").value;

  if (!date || !task || !start || !end) {
    alert("Please fill all fields");
    return;
  }

  const startTime = new Date(`1970-01-01T${start}`);
  const endTime = new Date(`1970-01-01T${end}`);
  const hours = (endTime - startTime) / 3600000;

  if (hours <= 0) {
    alert("End time must be after start time");
    return;
  }

  records.push({ date, task, start, end, hours });
  localStorage.setItem("timesheet", JSON.stringify(records));

  render();

  document.getElementById("task").value = "";
  document.getElementById("start").value = "";
  document.getElementById("end").value = "";
}

function render() {
  const container = document.getElementById("entries");
  container.innerHTML = "";

  let today = 0, month = 0, year = 0;
  const now = new Date();

  const grouped = {};
  records.forEach(r => {
    if (!grouped[r.date]) grouped[r.date] = [];
    grouped[r.date].push(r);
  });

  Object.keys(grouped).sort().forEach(date => {
    let dailyTotal = 0;
    let taskHtml = "";

    grouped[date].forEach(r => {
      const d = new Date(r.date);

      if (d.toDateString() === now.toDateString()) today += r.hours;
      if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) month += r.hours;
      if (d.getFullYear() === now.getFullYear()) year += r.hours;

      dailyTotal += r.hours;

      taskHtml += `
        <div class="task-row">
          <span class="task-name">${r.task}</span>
          <span class="task-time">${r.start} – ${r.end}</span>
          <span class="task-hours">${r.hours.toFixed(2)} hrs</span>
        </div>
      `;
    });

    container.innerHTML += `
      <div class="day-card">
        <div class="day-header">
          <span>${date}</span>
          <span>Total: ${dailyTotal.toFixed(2)} hrs</span>
        </div>
        ${taskHtml}
      </div>
    `;
  });

  document.getElementById("today").innerText = today.toFixed(1);
  document.getElementById("month").innerText = month.toFixed(1);
  document.getElementById("year").innerText = year.toFixed(1);
}

window.onload = render;
