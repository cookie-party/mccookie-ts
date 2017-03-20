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
