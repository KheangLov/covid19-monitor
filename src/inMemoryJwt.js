import Cookie from "js-cookie";

const inMemoryJWTManager = () => {
    const getToken = () => Cookie.get("token") ? Cookie.get("token") : null;
    const getCaseData = () => Cookie.get("internal_cases") ? Cookie.get("internal_cases") : null;
    const getLang = () => Cookie.get("lang_locale") ? Cookie.get("lang_locale") : null;

    const setToken = token => {
        Cookie.set("token", token);
        return true;
    };

    const setCaseData = data => {
        Cookie.set("internal_cases", data);
        return true;
    };

    const setLang = data => {
        Cookie.set("lang_locale", data);
        return true;
    };

    const ereaseToken = () => {
        Cookie.remove("token");
        return true;
    };

    const ereaseCaseData = () => {
        Cookie.remove("internal_cases");
        return true;
    };

    return {
        ereaseToken,
        getToken,
        setToken,
        getCaseData,
        ereaseCaseData,
        setCaseData,
        getLang,
        setLang,
    }
};

export default inMemoryJWTManager();