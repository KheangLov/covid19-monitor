import Cookie from "js-cookie";

const inMemoryJWTManager = () => {
    const getToken = () => Cookie.get("token") ? Cookie.get("token") : null;

    const setToken = token => {
        Cookie.set("token", token);
        return true;
    };

    const ereaseToken = () => {
        Cookie.remove("token");
        return true;
    };

    return {
        ereaseToken,
        getToken,
        setToken,
    }
};

export default inMemoryJWTManager();