export function cls(...classname: string[]) {
  return classname.join(" ");
}

export function getCurrentDateTime() {
  const now = new Date();

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
    timeZone: "Asia/Seoul",
  };

  return now;
}
