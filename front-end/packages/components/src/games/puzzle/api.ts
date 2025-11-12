

async function getRedirectURL(url: string) {
  try {
    const data = await fetch(url);
    if (data.status < 205) {
      return data.url;
    }
  } catch (e) { }
  return "";
}

export async function getRandomImage() {
  const uri = await getRedirectURL('https://picsum.photos/600/600/?random')

  return { uri, width: 600, height: 600 };
}