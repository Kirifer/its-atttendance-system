export const getWorkSchedule = (date = new Date()) => {
    const day = date.getDay();

    if (day === 0 || day === 6) {
        return null;
    }
    
    const start = new Date(date);
    const end = new Date(date);

    if (day === 3) {
        start.setHours(10, 0, 0, 0);
        end.setHours(19, 0, 0, 0);
    } else {
        start.setHours(9, 0, 0, 0);
        end.setHours(18, 0, 0, 0);
    }

    return { start, end };
}