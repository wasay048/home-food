export const parseClockTime = (raw) => {
  if (!raw) return null;

  // normalize multiple / non-breaking spaces to normal single space
  const s = raw
    .replace(/[\u00A0\u202F\u2007]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // 12h with AM/PM (case-insensitive)
  let m = s.match(/^(\d{1,2}):([0-5]\d)\s*([AaPp][Mm])$/);
  if (m) {
    let h = parseInt(m[1], 10);
    const min = parseInt(m[2], 10);
    const ampm = m[3].toLowerCase();
    if (h === 12) h = 0; // 12:xx AM -> 0h, 12:xx PM handled below
    if (ampm === "pm") h += 12; // add 12 for PM
    if (h >= 0 && h <= 23) return { h, min };
    return null;
  }

  // 24h format
  m = s.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
  if (m) {
    return { h: parseInt(m[1], 10), min: parseInt(m[2], 10) };
  }

  return null; // unsupported format
};
