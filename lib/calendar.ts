const publicCalendarId =
  "c_3cc50f452eeb9cf82d14d82e42fbd37ce78dbc72decd68830daa41a3553647d0@group.calendar.google.com";

const encodedId = encodeURIComponent(publicCalendarId);

export const publicCalendar = {
  embedUrl: `https://calendar.google.com/calendar/embed?src=${encodedId}&ctz=America%2FLos_Angeles&mode=AGENDA&showTitle=0&showPrint=0&showCalendars=0&showTz=1`,
  googleUrl: `https://calendar.google.com/calendar/u/0/r?cid=${encodedId}`,
  icalUrl: `https://calendar.google.com/calendar/ical/${encodedId}/public/basic.ics`,
  subscriptionUrl: `webcal://calendar.google.com/calendar/ical/${encodedId}/public/basic.ics`,
} as const;
