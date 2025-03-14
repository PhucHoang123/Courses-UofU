// bgImg is the background image to be modified.
// fgImg is the foreground image.
// fgOpac is the opacity of the foreground image.
// fgPos is the position of the foreground image in pixels. It can be negative and (0,0) means the top-left pixels of the foreground and background are aligned.
function composite(bgImg, fgImg, fgOpac, fgPos) {
    // Start positions on the background image
    var startBgX = Math.max(0, fgPos.x);
    var startBgY = Math.max(0, fgPos.y);

    // Start positions on the foreground image
    var startX = Math.max(0, -fgPos.x);
    var startY = Math.max(0, -fgPos.y);

    // Old calculation
    // Set bound to clip out part of fgImg if exceed limit
    //var endX = Math.min(fgImg.width, bgImg.width - startBgX + startX);
    //var endY = Math.min(fgImg.height, bgImg.height - startBgY + startY);

    // New fix for the bounds
    // Calculate the width and height to be drawn
    var drawWidth = Math.min(fgImg.width - startX, bgImg.width - startBgX);
    var drawHeight = Math.min(fgImg.height - startY, bgImg.height - startBgY);

    for (var y = 0; y < drawHeight; y++) {
        for (var x = 0; x < drawWidth; x++) {
            var fgIndex = ((startY + y) * fgImg.width + (startX + x)) * 4;
            var bgIndex = ((startBgY + y) * bgImg.width + (startBgX + x)) * 4;

            var fgAlpha = fgImg.data[fgIndex + 3] * fgOpac / 255;
            var bgAlpha = bgImg.data[bgIndex + 3] / 255;
            var combinedAlpha = fgAlpha + bgAlpha * (1 - fgAlpha);

            for (var color = 0; color < 3; color++) {
                bgImg.data[bgIndex + color] = (fgImg.data[fgIndex + color] * fgAlpha +
                                               bgImg.data[bgIndex + color] * bgAlpha * (1 - fgAlpha)) / combinedAlpha;
            }
            bgImg.data[bgIndex + 3] = combinedAlpha * 255;
        }
    }
}
