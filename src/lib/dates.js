// "YYYY-MM-DD" for the device's local day. Supabase returns logged_at in UTC,
// so slicing the string would move US evening entries onto the next day.
export function localDayKey(iso) {
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
