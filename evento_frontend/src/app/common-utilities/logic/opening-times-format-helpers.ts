import {Event} from '../../models/event';


/* calculate von bis for every event */
/* include always 24/7 open (is permanent and no openening times) von - bis per week day, if opening times than von - bis for every week day (open) and if von freitag 23 - sonntag 28 write with date von bis*/
export function openingTimesFormatter(event: Event): string {
        if(event.times.start === event.times.end)
           {  
            return 'immer offen'
            }
        else {
            return `${event.times.start} Uhr - ${event.times.end} Uhr`
        }
    }

export function dateTimesFormater(event: Event): string {
    if(event.permanent)
        return ''
    else {
    const start = new Date(event.date.start);
    const end = new Date(event.date.end);
    const day1 = start.getDate().toString().padStart(2, '0'); // Get day and pad with zero if needed
    const month1 = (start.getMonth() + 1).toString().padStart(2, '0'); // Get month (adding 1 as it's 0-indexed) and pad
    const year1 = start.getFullYear();

    const day2 = end.getDate().toString().padStart(2, '0'); // Get day and pad with zero if needed
    const month2 = (end.getMonth() + 1).toString().padStart(2, '0'); // Get month (adding 1 as it's 0-indexed) and pad
    const year2 = end.getFullYear();

    if(day1 === day2 && month1===month2 && year1===year2) {
        return `${day1}.${month1}.${year1}`
        return
    }

    else return `${day1}.${month1}.${year1} - ${day2}.${month2}.${year2}`;
    } 
}