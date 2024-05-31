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

function isDateInBetween(date, startDate, endDate) {
  // Convert date strings to Date objects for easy comparison
  const parsedDate = new Date(date).getTime();
  const parsedStartDate = new Date(startDate).getTime();
  const parsedEndDate = new Date(endDate).getTime();

  // Compare the dates
  return parsedDate >= parsedStartDate && parsedDate <= parsedEndDate;
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

isEventTodayAndStartTimeLater = (event, date, time) => {
  //if date is today than start date of event should be later than now
  if (isDateEqual(date, new Date())) {
    return isTimeLater(event.times.start, time);
  }
  return (
    isDateInBetween(date, event.date.start, event.date.end) &&
    !isTimeLater(event.times.end, time)
  );
};

isEventOnActualDateAndTime = (event, date, time) => {
  if (
    isDateEqual(event.date.end, date) &&
    !isTimeLater(event.times.end, time)
  ) {
    return false;
  }

  return (
    isDateEqual(date, new Date()) &&
    !isTimeLater(event.times.start, time) &&
    !isDateEqual(event.date.end) &&
    isTimeLater(event.times.end, time)
  );
};

function isFrequencyToday(frequency, date) {
  if (frequency["weekly"]) {
    return frequency.weekly.includes(new Date(date).getDay().toString());
  } else {
    return false;
  }
}

isFrequencyRightNow = (event, date, time) => {
  if (event.frequency["weekly"]) {
    // is today in the weekly frequency
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
function isEventOnDate(event, date) {}

module.exports = {
  isTimeLater,
  isDateEqual,
  formatTime,
  isEventOnDate,
  isEventTodayAndStartTimeLater,
  isEventOnActualDateAndTime,
  isFrequencyToday,
  isFrequencyRightNow,
};
