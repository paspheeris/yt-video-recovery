
// Based on the demo by Dan Abramov at 
// https://egghead.io/lessons/javascript-redux-persisting-the-state-to-the-local-storage

export const loadState = (keyName) => {
    try {
        const serializedState = localStorage.getItem(keyName);
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

export const saveState = (keyName, state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem(keyName, serializedState);
    } catch (err) {
        console.log(err);
    }
};
