function showMedia() {
    let txn = db.transaction("Media", "readonly");
    let mediaStore = txn.objectStore("Media");
    let cursorObject = mediaStore.openCursor();

    cursorObject.onsuccess = function(e) {
        let cursor = cursorObject.result;
        if (cursor) {
            let media = cursor.value;
            console.log(media);
            if (media.mediaType == "image") {
                appendImage(media);
            } else {
                appendVideo(media);
            }
            cursor.continue();
        }
    };
}

let iv = setInterval(function() {
    if (db) {
        showMedia();
        clearInterval(iv);
    }
}, 100);

let gallery = document.querySelector(".gallery");
let backBtn = document.querySelector(".back-btn");

backBtn.addEventListener("click", function() {
    window.location.assign("index.html");
})

function createMediaDiv(mediaType) {
    let mediaDiv = document.createElement("div");
    mediaDiv.classList.add("gallery-item");
    mediaDiv.innerHTML = `<div class="media">
    </div>
    <div class="media-buttons">
    <div class="download"><i class="fas fa-download"></i></div>
    <div class="delete"><i class="fas fa-trash"></i></div>
    </div>`;
    return mediaDiv;
}

function appendImage(media) {
    let mediaDiv = createMediaDiv();
    mediaDiv.setAttribute("mid", media.mid);
    let image = document.createElement("img");
    image.src = media.mediaSource;

    mediaDiv.querySelector(".media").append(image);
    gallery.append(mediaDiv);

    mediaDiv.querySelector(".download").addEventListener("click", function() {
        downloadMedia(media);
    });
    mediaDiv.querySelector(".delete").addEventListener("click", function() {
        deleteMedia(media);
    });
}

function appendVideo(media) {
    let blob = new Blob([media.mediaSource], { type: "video/mp4" });
    let videoUrl = URL.createObjectURL(blob);

    let mediaDiv = createMediaDiv();
    mediaDiv.setAttribute("mid", media.mid);

    let video = document.createElement("video");
    video.src = videoUrl;
    video.autoplay = "true";
    video.loop = "true";
    video.controls = "true";

    mediaDiv.querySelector(".media").append(video);
    gallery.append(mediaDiv);

    mediaDiv.querySelector(".download").addEventListener("click", function() {
        downloadMedia(media);
    });
    mediaDiv.querySelector(".delete").addEventListener("click", function() {
        deleteMedia(media);
    });
}

function deleteMedia(media) {
    let mid = media.mid;
    // DB se remove
    let txn = db.transaction("Media", "readwrite");
    let mediaStore = txn.objectStore("Media");
    mediaStore.delete(mid);

    // UI se remove
    document.querySelector(`div[mid="${mid}"]`).remove();
}

function downloadMedia(media) {
    let aTag = document.createElement("a");
    if (media.mediaType == "image") {
        aTag.download = "image.png";
        aTag.href = media.mediaSource;
    } else {
        let blob = new Blob([media.mediaSource], { type: "video/mp4" });
        let videoUrl = URL.createObjectURL(blob);
        aTag.download = "video.mp4";
        aTag.href = videoUrl;
    }
    aTag.click();
    aTag.remove();
}