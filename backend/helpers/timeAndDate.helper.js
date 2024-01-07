exports.isTimeLater = (time1, time2) => {
  // Convert time strings to Date objects for easy comparison
  const date1 = new Date(`2000-01-01T${formatTime(time1)}`);
  const date2 = new Date(`2000-01-01T${formatTime(time2)}`);
  // Compare the times
  return date1.getTime() > date2.getTime();
}

exports.isDateEqual = (date1, date2) => {
  // Convert date strings to Date objects for easy comparison
  const parsedDate1 = new Date(date1);
  const parsedDate2 = new Date(date2);

  // Compare the dates
  return parsedDate1.getTime() === parsedDate2.getTime();
}

function formatTime(time) {
  const components = time.split(':');

  // Ensure that hours have leading zeros if needed
  const formattedHours = components[0].padStart(2, '0');

  // If the time string has only hours and minutes, append ':00'
  const formattedTime = components.length === 2
    ? `${formattedHours}:${components[1]}:00`
    : time;

  return formattedTime;
}
