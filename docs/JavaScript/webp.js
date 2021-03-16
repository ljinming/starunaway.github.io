function checkWebp() {
  try {
    return document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
  } catch (e) {
    return false;
  }
}

const supportWebp = checkWebp();

function getWebpImgUrl(url) {
  if (!url) {
    throw new Error('no url');
  }
  if (url.startsWith('data:')) {
    return url;
  }
  if (!supportWebp) {
    return url;
  }

  return url + '?x-oss-process......';
}
