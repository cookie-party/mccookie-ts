import Constant from '../constant';

export const toJSON: (arg: string) => Object = (arg: any) => {
    arg = (typeof arg === "function") ? arg() : arg;
    if (typeof arg  !== "string") {
        return null;
    }
    try {
    arg = (!JSON) ? eval("(" + arg + ")") : JSON.parse(arg);
        return arg;
    } catch (e) {
        return null;
    }
};

export const createTweetText = (key, value) => {
    return key + Constant.SEPARATOR + value + Constant.SEPARATOR + Constant.HASHTAG;
}