const options: Intl.DateTimeFormatOptions = {
    // weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
};

export function formatDate(date: string, locales = 'en') {
    const dateToFormat = new Date(date);
    return new Intl.DateTimeFormat(locales, options).format(dateToFormat);
}
