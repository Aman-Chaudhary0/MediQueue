//  TO SAVE IMAGES IN DATABASE IN URL FORMAT
import ImageKit from "imagekit";

const {
  IMAGEKIT_PUBLIC_KEY,
  IMAGEKIT_PRIVATE_KEY,
  IMAGEKIT_URL_ENDPOINT,
} = process.env;

// Check if all required ImageKit config variables are present
const hasAllConfig =
  Boolean(IMAGEKIT_PUBLIC_KEY) &&
  Boolean(IMAGEKIT_PRIVATE_KEY) &&
  Boolean(IMAGEKIT_URL_ENDPOINT);

let imagekit = null;

// Only initialize ImageKit if all config variables are present
if (hasAllConfig) {
  imagekit = new ImageKit({
    publicKey: IMAGEKIT_PUBLIC_KEY,
    privateKey: IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: IMAGEKIT_URL_ENDPOINT,
  });
}

export default imagekit;
export { hasAllConfig };
