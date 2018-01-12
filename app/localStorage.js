export const LOCAL_STORAGE_KEY = '_bootcamp_planning';

const initState = {
    isLoggin: false
}
export const loadLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (serializedState === null) {
      return initState;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return initState;;
  }
}

export const updateLocalStorage = (state) =>
{
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(LOCAL_STORAGE_KEY, serializedState);
  } catch (err) {
    
  }
}
