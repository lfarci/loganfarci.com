const setLandingPageContent = (content, mediaFolder = "static") => {

    if (content.picture) {
        const image = document.getElementById("picture");
        if (image) {
            image.src = `${mediaFolder}/${content.picture}`;
        }
    }

    if (content.name) {
        const nameDivElement = document.getElementById("name");
        nameDivElement.innerHTML = content.name;
    }

    if (content.role) {
        const roleDivElement = document.getElementById("role");
        roleDivElement.innerHTML = content.role;
    }

    if (content.description) {
        const descriptionSpanElement = document.getElementById("description");
        descriptionSpanElement.innerHTML = content.description;
    }

};

const loadLandingPageContent = async (contentFileName = "/content/pages/index.json") => {
    const response = await fetch(contentFileName);
    const json = await response.json();
    console.log(json)
    setLandingPageContent(json);
};

loadLandingPageContent();