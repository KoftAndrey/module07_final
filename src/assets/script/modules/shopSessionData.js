const shopSessionData = {
  set: (field, value) => {
    const currentObj = JSON.parse(sessionStorage.getItem('shop'));

    const newObj = currentObj ? { ...currentObj, [field]: value } : { [field]: value };

    sessionStorage.setItem('shop', JSON.stringify(newObj))
  },
  get: (field) => {
    const currentObj = JSON.parse(sessionStorage.getItem('shop'));
    return currentObj[field];
  },
  clear: () => { sessionStorage.removeItem('shop') }
}

export default shopSessionData;
