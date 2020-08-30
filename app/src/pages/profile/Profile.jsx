/* eslint-disable global-require */
import 'regenerator-runtime/runtime'
import React, { useEffect, useState } from 'react'
import { Layout } from '../../components/layout'
import { Button, ButtonGroup, Flex } from '../../components/styles'
import { Camera, Wrapper, Error, Video, Canvas, Download } from './style'

const CAMERA_HEIGHT = 400
const CAMERA_WIDTH = 300

const Profile = () => {
  const [errorMsg, setErrorMsg] = useState('none')
  const [shot, setShot] = useState(null)
  const canvas = React.createRef()
  const streamContainer = React.createRef()

  useEffect(() => {
    async function streamVideo() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        })

        streamContainer.current.srcObject = stream
        streamContainer.current.play()
      } catch (error) {
        console.log(`Error streaming video: ${error}`)
        setErrorMsg('block')
      }
    }

    streamVideo()
  }, [])

  function handleShot() {
    const video = streamContainer.current

    canvas.current.width = CAMERA_WIDTH
    canvas.current.height = CAMERA_HEIGHT
    canvas.current
      .getContext('2d')
      .drawImage(video, -150, 0, 550, CAMERA_HEIGHT)

    const img = canvas.current.toDataURL('image/jpeg')
    setShot(img)
    console.log('img', img)
  }

  function handleClearShot() {
    const context = canvas.current.getContext('2d')
    context.clearRect(0, 0, CAMERA_WIDTH, CAMERA_HEIGHT)
  }

  function handleSaveShot() {
    var anchor = document.createElement('a')
    anchor.href = draw.toDataURL('image/png')
    anchor.download = 'girbil-avatar.jpeg'

    handleClearShot()
  }

  return (
    <Layout title='Take a snapshot'>
      <Error display={errorMsg}>Please enable access and attach a camera</Error>
      <Flex>
        <Wrapper>
          <Camera>
            Webcam stream shows here
            <Video playsinline autoplay ref={streamContainer}></Video>
          </Camera>
          <Button className='primary' onClick={handleShot}>
            Take shot
          </Button>
        </Wrapper>
        <Wrapper>
          <Camera>
            uploaded snapshot shows here
            <Canvas ref={canvas}></Canvas>
          </Camera>
          <ButtonGroup flexDirection={'row'}>
            <Button
              className='green'
              onClick={handleClearShot}
              width={shot !== null ? '50%' : '100'}>
              Clear
            </Button>
            {shot !== null && (
              <Download href={shot} download='girbil-avatar.jpeg'>
                <Button className='green'>Save</Button>
              </Download>
            )}
          </ButtonGroup>
        </Wrapper>
      </Flex>
    </Layout>
  )
}

export default Profile
