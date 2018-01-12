
import moment from "moment";

/**
 * @description show the log progress
 * @param {*} progress_msg 
 * @param {*} progress_details 
 * @param {*} progress_group 
 */
export const showProgressLog = function(progress_msg, progress_details, progress_group) {
    if (process.env.NODE_ENV !== "production"
    || /[?&]debug=true/i.test(window.location.search)) {
        if (progress_group) { progress_group = '[' + progress_group + ']' }
        else { progress_group = "" }
        // https://developer.mozilla.org/en-US/docs/Web/API/Console/table
        // https://developers.google.com/web/tools/chrome-devtools/console/console-write
        // https://developers.google.com/web/tools/chrome-devtools/console/console-reference
        // https://developers.google.com/web/updates/2015/07/print-out-a-quick-stack-trace-from-the-console
        const prompt = ' [' + moment().format("YYYY-MM-DD HH:mm:ss") + '] ';
        // console.group(progress_group);
        console.groupCollapsed(progress_group + prompt + progress_msg);
        // console.log(prompt, progress_msg);
        if (progress_details) console.debug(progress_details);
        console.trace();
        console.groupEnd();
    }
}

export const disableGetDefaultPropsWarning = () => {
    const warning = "Warning: getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.";
    const consoleError = console.error.bind(console);

    console.error = (...args) => {
        if (args[0] === warning) return;
        return consoleError(...args);
    };
};

export const assert = function(test, cmtIfFail) {
    if (!test) show_progress_log('Assert Did failed : ' + cmtIfFail);
    // https://developers.google.com/web/tools/chrome-devtools/console/console-reference#assert
    // console.assert(a > b, {"message":"a is not greater than b","a":a,"b":b});
    console.assert(test, cmtIfFail);
}

export const count = function(testedString) {
    console.count(testedString);
}

export const start_time_monitoring = function(tag) {
    // Start timing now
    console.time(tag);
}

export const end_time_monitoring = function(tag) {
    console.timeEnd(tag);
}