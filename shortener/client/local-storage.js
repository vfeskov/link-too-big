export function loadList () {
  try {
    const text = window.localStorage.getItem('link-too-big');
    const list = JSON.parse(text);
    if (!Array.isArray(list)) { throw Error(); }
    if (
      list.some(i =>
        !Array.isArray(i) ||
        i.some(s => typeof s !== 'string')
      )
    ) { throw Error(); }
    return list;
  } catch (e) {
    return [];
  }
}

export function saveList (list) {
  const text = JSON.stringify(list);
  window.localStorage.setItem('link-too-big', text);
}
