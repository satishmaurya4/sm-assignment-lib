export const currentTime = () => {
    const date = new Date();
    const hour = date.getHours();
    if (hour < 12) {
        return "Good Morning";
    } else if (hour > 12) {
        return "Good Evening";
    } else {
        return "Good Noon";
    }
    
}


