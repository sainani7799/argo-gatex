import moment from "moment";

export function getProperDateWithTime(date: Date | string, secs?: boolean) {
    if(!date) {
        return null;
    }
    // 24 hours format of the local systen where the app is running
    if(secs) {
        return moment(date).local().format('YYYY-MM-DD HH:mm:ss');
    } else {
        return moment(date).local().format('YYYY-MM-DD HH:mm');
    }
}

export function getCurrentDateTime(secs?: boolean) {
    if(secs) {
        return moment().local().format('YYYY-MM-DD HH:mm:ss');
    } else {
        return moment().local().format('YYYY-MM-DD HH:mm');
    }
}

export function  getProperDate(date: Date | string) {
    if(!date) {
        return null;
    }
    return moment(date).local().format('YYYY-MM-DD');
}

export function getCurrentDate(secs?: boolean) {
    return moment().local().format('YYYY-MM-DD');
}



export const getLayoutSettings = (perRowCount: number = 3) => {
    if (perRowCount === 2) {
        return {
            column1: {
                xs: { span: 24 },
                sm: { span: 24 },
                md: { span: 11 },
                lg: { span: 11 },
                xl: { span: 11 }
            },
            column2: {
                xs: { span: 24 },
                sm: { span: 24 },
                md: { span: 11, offset: 2 },
                lg: { span: 11, offset: 2 },
                xl: { span: 11, offset: 2 }
            }
        }
    } else if (perRowCount === 3) {
        return {
            column1: {
                xs: { span: 24 },
                sm: { span: 24 },
                md: { span: 7 },
                lg: { span: 7 },
                xl: { span: 7 }
            },
            column2: {
                xs: { span: 24 },
                sm: { span: 24 },
                md: { span: 7, offset: 1 },
                lg: { span: 7, offset: 1 },
                xl: { span: 7, offset: 1 }
            }
        }
    } else if (perRowCount === 4) {
        return {
            column1: {
                xs: { span: 24 },
                sm: { span: 24 },
                md: { span: 5 },
                lg: { span: 5 },
                xl: { span: 5 }
            },
            column2: {
                xs: { span: 24 },
                sm: { span: 24 },
                md: { span: 5, offset: 1 },
                lg: { span: 5, offset: 1 },
                xl: { span: 5, offset: 1 }
            }
        }
    } else {
        return {
            column1: {
                xs: { span: 24 },
                sm: { span: 24 },
                md: { span: 11 },
                lg: { span: 11 },
                xl: { span: 11 }
            },
            column2: {
                xs: { span: 24 },
                sm: { span: 24 },
                md: { span: 11, offset: 2 },
                lg: { span: 11, offset: 2 },
                xl: { span: 11, offset: 2 }
            }
        }
    }
}