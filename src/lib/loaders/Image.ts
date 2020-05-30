//
// promise-based image loader.
//
// Authors:
// * @bhouston
//

export function fetchImage(url: string) {

    return new Promise((resolve, reject) => {

        let image = new Image();

        image.addEventListener('load', e => resolve(image));
        image.addEventListener('error', () => {
            reject(new Error(`Failed to load image's URL: ${url}`));
        });

        image.src = url;

    });
}

// load the image, and append it to the element id="image-holder"
//  loadImage('http://thecatapi.com/api/images/get?format=src&type=jpg&size=small')
//    .then(img => document.getElementById('image-holder').appendChild(img))
//    .catch(error => console.error(error));