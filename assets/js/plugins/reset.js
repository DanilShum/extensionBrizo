export const ResetPlugin = (store) => {
  const initialStateSnapshot = JSON.stringify(store.state);

  store.reset = () => {
    const state = JSON.parse(initialStateSnapshot);
    store.replaceState(state);
  };
};
