export class SequenceUtils {

    static convertNoSequence(cutNo: string) {
        return ('000' + cutNo).slice(-3)
    }

    static formatNumberToSpecificLength(number: string, length?: number) {
        if (!length)
            length = 4
        let r = "" + number;
        while (r.length < length) {
            r = "0" + r;
        }
        return r;
    }

}