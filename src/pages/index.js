import React from "react"

import layoutStyles from "./index.css"
import image from "../images/wave.svg"

var canvasActivated = false

function setupCanvas() {
  if (canvasActivated) {
    return
  }
  canvasActivated = true

  document.getElementById("clickHeader").hidden = true

  //cavnas
  var canvas = document.getElementById("specCanvas")

  //2D context of canvas
  var contextOfCanvas = canvas.getContext("2d")

  const canvasWidth = (canvas.width = window.innerWidth)
  const canvasHeight = (canvas.height = window.innerHeight)

  //connect our stream to our analyzer, and ask our anaylzer for specific types of data
  //ie frequency spectrum at our current point in time
  const audioContext = new AudioContext()
  const analyser = audioContext.createAnalyser()

  //how detailed our data is going to be
  analyser.fftSize = 1024

  // microphone
  navigator.mediaDevices.getUserMedia({ audio: true }).then(process)

  //takes our audio stream
  function process(audioStream) {
    //wraps stream in a source object allows us to connect our stream to our analyzer
    const audioSource = audioContext.createMediaStreamSource(audioStream)
    audioSource.connect(analyser)

    //array of audio data with  has length of audioContext.fftSize
    const audioData = new Uint8Array(analyser.frequencyBinCount)
    const dataLength = audioData.length

    const lineHeight = canvasHeight / dataLength
    const xPosition = canvasWidth - 1

    contextOfCanvas.fillStyle = `hsl(280, 100%, 10%)`
    contextOfCanvas.fillRect(0, 0, canvasWidth, canvasHeight)

    loop()

    function loop() {
      //call again on next frame
      window.requestAnimationFrame(loop)

      //take data and move it one pixel to the left
      let imageData = contextOfCanvas.getImageData(
        1,
        0,
        canvasWidth - 1,
        canvasHeight
      )

      contextOfCanvas.fillRect(0, 0, canvasWidth, canvasHeight)
      contextOfCanvas.putImageData(imageData, 0, 0)

      //analyser will populate and transform data array
      analyser.getByteFrequencyData(audioData)

      for (let i = 0; i < dataLength; i++) {
        let ratio = audioData[i] / 255

        let hue = (ratio * 120 + 280) % 360
        let saturation = "100%"
        let lightness = 10 + 70 * ratio + "%"

        contextOfCanvas.beginPath()
        contextOfCanvas.strokeStyle = `hsl(${hue}, ${saturation}, ${lightness})`
        contextOfCanvas.lineWidth = 15
        contextOfCanvas.moveTo(xPosition, canvasHeight - i * lineHeight)
        contextOfCanvas.lineTo(
          xPosition,
          canvasHeight - (i * lineHeight + lineHeight)
        )
        contextOfCanvas.stroke()
      }
    }
  }
}

export default function Home() {
  return (
    <div>
      <div className="image-div">
        <a href="https://github.com/renchris/spectrogram" target="_blank">
          <img alt="Spectrogram" src={image} />
        </a>
        <h1 className="image-title">Specotgram</h1>
      </div>
      <h1 id="clickHeader" onClick={setupCanvas}>
        Click to Start
      </h1>
      <canvas
        onClick={setupCanvas}
        id="specCanvas"
        className={layoutStyles.canvas}
      ></canvas>
    </div>
  )
}
