import moment from 'moment';
const returnItemAfterEvaluation = function (evaluation, item) {
    const currentDate = moment();
    if (item.extraRepeatToday && item.actualTimesRepeated > 0 && item.nextRepetition <= currentDate) {
        if (evaluation >= 4) {
            item.extraRepeatToday = false;
        }
    }
    else {
        const newParameters = processEvaluation(evaluation, item.easinessFactor, item.timesRepeated, item.previousDaysChange);

        // nextRepetition is to 18 hours earlier than it should be
        item.nextRepetition = moment(currentDate).add("days", newParameters.daysChange - 1).add("hours", 6).toString();
        item.easinessFactor = newParameters.easinessFactor;

        if (newParameters.resetTimesRepeated) {
            item.extraRepeatToday = true;
            item.timesRepeated = 0;
        }
        else {
            if (evaluation === 3) {
                item.extraRepeatToday = true;
            }
            item.timesRepeated++;
        }

        item.actualTimesRepeated++;
        item.previousDaysChange = newParameters.daysChange;
    }

    const _repetitionTime = moment().toString();
    item.lastRepetition = _repetitionTime;

    return item;
};

export default returnItemAfterEvaluation;

const processEvaluation = function (evaluation, easinessFactor, timesRepeated, previousDaysChange) {
    let resetTimesRepeated = false;
    let daysChange;
    easinessFactor = _calculateEasinessFactor(evaluation, easinessFactor);
    if (evaluation < 3) {
        daysChange = 1;
        resetTimesRepeated = true;
    }
    else if (timesRepeated === 0) {
        daysChange = 1;
    }
    else if (timesRepeated === 1) {
        daysChange = 5;
    }
    else {
        daysChange = Math.round(previousDaysChange * easinessFactor);
    }
    return {daysChange, easinessFactor, resetTimesRepeated}
};

const _calculateEasinessFactor = function (evaluation, easinessFactor) {
    const newEasinessFactor = _roundToTwo(easinessFactor - 0.8 + (0.28 * evaluation) - (0.02 * evaluation * evaluation));
    if (newEasinessFactor <= 1.3) {
        return 1.3;
    }
    else if (newEasinessFactor >= 3.0) {
        return 3.0;
    }
    else {
        return newEasinessFactor;
    }
}


const _roundToTwo = function (value) {
    return (Math.round(value * 100) / 100);
}