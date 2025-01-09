document.getElementById('search-form').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent form submission
  
    const start = document.getElementById('start').value;
    const end = document.getElementById('end').value;
    const text = document.getElementById('text').value;

    var queryParams = "?"
    if (start != "") {
      // Convert human-readable date to Unix timestamp (in seconds)
      const startTimestamp = convertToUnixTimestamp(start); // Convert to Unix timestamp (seconds)
      queryParams += `start=${startTimestamp}&`
    }

    if (end != "") {
      const endTimestamp = convertToUnixTimestamp(end); // Convert to Unix timestamp (seconds)
      queryParams += `end=${endTimestamp}&`
    }

    if (text != "") {
      queryParams += `text=${text}`
    }
    var url = `http://localhost:8080/query` + queryParams;
    console.log(url)
    try {
      const response = await fetch(url);
      const logs = await response.json();
  
      // Clear existing rows in the table
      const tbody = document.getElementById('log-table').getElementsByTagName('tbody')[0];
      tbody.innerHTML = '';
  
      // Populate the table with new logs
      console.log(logs)
      logs.message.forEach(logEntry => {
        const row = tbody.insertRow();
  
        const timeCell = row.insertCell(0);
        timeCell.textContent = new Date(logEntry.time * 1000).toLocaleString(); // Convert Unix time
  
        const bodyCell = row.insertCell(1);
        bodyCell.textContent = logEntry.log.body;
  
        const serviceCell = row.insertCell(2);
        serviceCell.textContent = logEntry.log.service;
  
        const severityCell = row.insertCell(3);
        severityCell.textContent = logEntry.log.severity;
      });
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  });
  

  // Function to convert human-readable date to Unix timestamp (in seconds)
function convertToUnixTimestamp(dateString) {
  // Split the date and time, remove 'PM' or 'AM' if present, and create a Date object
  let [date, time, period] = dateString.split(", ");
  let [month, day, year] = date.split("/");
  let [hour, minute, second] = time.split(":");

  // Adjust for 12-hour time format (AM/PM)
  if (period && period.toUpperCase() === 'PM' && parseInt(hour) < 12) {
    hour = (parseInt(hour) + 12).toString();
  } else if (period && period.toUpperCase() === 'AM' && parseInt(hour) === 12) {
    hour = '00';
  }

  // Create the correct Date string for JavaScript to parse
  const formattedDateString = `${month}/${day}/${year} ${hour}:${minute}:${second}`;
  
  // Convert the formatted date string to Unix timestamp
  const unixTimestamp = new Date(formattedDateString).getTime() / 1000;

  return unixTimestamp;
}