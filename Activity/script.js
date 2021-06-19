let videoplayer = document.querySelector("video");
let recordButton = document.querySelector("#record");
let photoButton = document.querySelector("#capture");
let zoomIn = document.querySelector("#in");
let zoomOut = document.querySelector("#out");
let recordingState = false;
let constraints = { video: true };
let recordedData;
let mediaRecorder;
let maxZoom = 3;
let minZoom = 1;
let currZoom = 1;

(async function() {
    let mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
    videoplayer.srcObject = mediaStream;
    mediaRecorder = new MediaRecorder(mediaStream);

    mediaRecorder.onstart = function(e) {
        console.log("iNSIDE OF start");
        console.log(e);
    };
    mediaRecorder.onstop = function(e) {
        console.log("Inside on stop.");
        console.log(e);
    };
    mediaRecorder.ondataavailable = function(e) {
        console.log("Inside on data availake");
        recordedData = e.data;
        saveVideoTofs();
    };

    recordButton.addEventListener("click", function() {
        if (recordingState) {
            mediaRecorder.stop();
            recordButton.querySelector("div").classList.remove("record-animate");
        } else {
            mediaRecorder.start();
            recordButton.querySelector("div").classList.add("record-animate");
        }
        recordingState = !recordingState;
    });

    photoButton.addEventListener("click", capturePhotos);
    zoomIn.addEventListener("click", function() {
        if (currZoom + 0.1 <= maxZoom) {
            currZoom += 0.1;
            videoplayer.style.transform = `scale(${currZoom})`;
        }
    });
    zoomOut.addEventListener("click", function() {
        if (currZoom - 0.1 >= minZoom) {
            currZoom -= 0.1;
            videoplayer.style.transform = `scale(${currZoom})`;
        }
    });
})();

function saveVideoTofs() {
    console.log("video saving");
    let blob = new Blob([recordedData], { type: "video/mp4" });

    let iv = setInterval(function() {
        if (db) {
            saveMedia("video", blob);
            clearInterval(iv);
        }
    }, 100);
    console.log(videourl);
}

function capturePhotos() {
    photoButton.querySelector("div").classList.add("capture-animate");
    setTimeout(function() {
        photoButton.querySelector("div").classList.remove("capture-animate");
    }, 1000)
    let canvas = document.createElement("canvas");
    canvas.height = videoplayer.videoHeight;
    canvas.width = videoplayer.videoWidth;

    let ctx = canvas.getContext("2d");
    if (currZoom != 1) {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(currZoom, currZoom);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
    }
    ctx.drawImage(videoplayer, 0, 0);

    let imageUrl = canvas.toDataURL("1/jpg");

    let iv = setInterval(function() {
        if (db) {
            saveMedia("image", imageUrl);
            clearInterval(iv);
        }
    }, 100);

}