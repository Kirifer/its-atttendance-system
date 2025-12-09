export const getWorkSchedule = (date = new Date()) => {
    const day = date.getDay();

    if (day === 0 || day === 6) {
        return null;
    }
    
    const start = new Date();
    const end = new Date();

    if (day === 3) {
        start.setHours(10,0,0,0);
        end.setHours(19, 0, 0, 0);
    } else {
        start.setHours(9, 0, 0, 0);
        end.setHours(6, 0, 0, 0);
    }

    return { start, end };
}