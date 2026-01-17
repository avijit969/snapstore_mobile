const dateCovertToLocalDate = (dateTimeInMs: number | string | Date): string => {
    const date = new Date(dateTimeInMs);
    const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    const formattedTime = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    });
    const fullDateTime = `${formattedDate} at ${formattedTime}`;
    return fullDateTime;
};

export default dateCovertToLocalDate;
