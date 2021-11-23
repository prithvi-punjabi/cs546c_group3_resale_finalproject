function formatDaysAgo(value, locale) {
  const date = new Date(value);
  const deltaDays = (date.getTime() - Date.now()) / (1000 * 3600 * 24);
  const formatter = new Intl.RelativeTimeFormat(locale);
  return formatter.format(Math.round(deltaDays), "days");
}

console.log(formatDaysAgo("11/20/2021, 5:37:37 AM"));
