// is time1 later than time2
function isTimeLater(time1, time2) {
  // Convert time strings to Date objects for easy comparison
  const date1 = new Date(`2000-01-01T${formatTime(time1)}`);
  const date2 = new Date(`2000-01-01T${formatTime(time2)}`);
  // Compare the times
  return date1.getTime() > date2.getTime();
}

function isDateEqual(date1, date2) {
  // Convert date strings to Date objects for easy comparison
  const parsedDate1 = new Date(date1);
  const parsedDate2 = new Date(date2);

  // Compare the dates
  return parsedDate1.getTime() === parsedDate2.getTime();
}

function formatTime(time) {
  const components = time.split(":");

  // Ensure that hours have leading zeros if needed
  const formattedHours = components[0].padStart(2, "0");

  // If the time string has only hours and minutes, append ':00'
  const formattedTime =
    components.length === 2 ? `${formattedHours}:${components[1]}:00` : time;

  return formattedTime;
}

exports.isEventTodayAndStartTimeLater = (event, date, time) => {
  return (
    isDateEqual(event.date.end, date) && !isTimeLater(event.times.end, time)
  );
};

exports.isEventOnActualDateAndTime = (event, date, time) => {
  if (
    isDateEqual(event.date.start, date) &&
    !isTimeLater(event.times.start, time)
  ) {
    return true;
  } else if (
    isDateEqual(event.date.end, date) &&
    isTimeLater(event.times.end, time)
  ) {
    return true;
  } else if (
    new Date(event.date.start).getTime() < new Date(date).getTime() &&
    new Date(event.date.end).getTime() > new Date(date).getTime()
  ) {
    return true;
  } else {
    return false;
  }
};

exports.isFrequencyToday = (frequency, date) => {
  if (frequency["weekly"]) {
    return frequency.weekly.includes(new Date(date).getDay().toString());
  } else {
    return false;
  }
};

exports.isFrequencyRightNow = (event, date, time) => {
  if (event.frequency["weekly"]) {
    if (event.frequency.weekly.includes(new Date(date).getDay().toString())) {
      return (
        (!isTimeLater(event.times.start, time) &&
          isDateEqual(new Date(event.date.end), new Date(event.date.start)) &&
          isTimeLater(event.times.end, time)) ||
        new Date(event.date.end) > new Date(event.date.start)
      );
    } else {
      return false;
    }
  } else {
    return false;
  }
};
