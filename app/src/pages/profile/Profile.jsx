/* eslint-disable global-require */
import 'regenerator-runtime/runtime'
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
const Buffer = require('buffer/').Buffer
import { Layout } from '../../components/layout'
import { Button, ButtonGroup, Flex } from '../../components/styles'
import { Camera, Wrapper, Error, Video, Canvas, Download } from './style'

const CAMERA_HEIGHT = 400
const CAMERA_WIDTH = 300

const Profile = () => {
  const [errorMsg, setErrorMsg] = useState('none')
  const [shot, setShot] = useState(null)
  const [uuid, setUuid] = useState(null)
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

        // UUID would ideally come from db or any single source of true. 
        // This is just a quick implementation
        setUuid(uuidv4())
      } catch (error) {
        console.log(`Error streaming video: ${error}`)
        setErrorMsg('block')
      }
    }

    streamVideo()
  }, [])

  // NOTE: This function is not really necessary, I mostly implemented
  // for the sake of showing how to get and download an image from S3.
  // I personally think is better to give the local image to the user
  // which make the process faster and with better performance
  // since the image doesn't need to be download again
  async function getSignedUrl() {
    try {
      const res = await fetch('http://localhost:3000/api/get-presigned-url', {
        method: 'POST',
        mode: 'cors',
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          id: uuid,
        }),
      })

      const { getSignedUrl } = await res.json()
      setShot(getSignedUrl)
    } catch (err) {
      // Note: ideally here a better error handling
      console.log('error')
    }
  }

  useEffect(() => {
    async function fetchPutSignedUrl() {
      try {
        const res = await fetch('http://localhost:3000/api/put-presigned-url', {
          method: 'POST',
          mode: 'cors',
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify({
            id: uuid,
            contentType: 'image/jpg',
          }),
        })

        const { putSignedUrl } = await res.json()
        if (shot !== null) {
          return await uploadShot(putSignedUrl)
        }
      } catch (err) {
        // Note: ideally here a better error handling
        console.log('error')
      }
    }

    fetchPutSignedUrl()
  }, [shot])

  async function uploadShot(putSignedUrl) {
    console.log('putSignedUrl', putSignedUrl)
    const buffer = Buffer.from(shot.replace(/^data:image\/\w+;base64,/, ""), 'base64');

    // console.log('buffer', buffer)
    // console.log('shot', shot)
    try {
      const uploadRes = await fetch(putSignedUrl, {
        method: 'PUT',
        mode: 'cors',
        body: shot,
      })
      console.log('uploaded!')
      return

    } catch (err) {
      // Note: ideally here a better error handling
      console.log('error uploading shot')
    }
  }



  function handleShot() {
    const video = streamContainer.current
    canvas.current.width = CAMERA_WIDTH
    canvas.current.height = CAMERA_HEIGHT
    canvas.current
      .getContext('2d')
      .drawImage(video, -150, 0, 550, CAMERA_HEIGHT)

    const img = canvas.current.toDataURL('image/jpeg')
    setShot(img)
    // fetchPutSignedUrl()
  }

  function handleClearShot() {
    const context = canvas.current.getContext('2d')
    context.clearRect(0, 0, CAMERA_WIDTH, CAMERA_HEIGHT)
  }

  return (
    <Layout title='Take a snapshot'>
      <Error display={errorMsg}>Please enable access and attach a camera</Error>
      <Flex>
        <Wrapper>
          <Camera>
            Webcam stream shows here
            <Video playsinline autoplay ref={streamContainer} />
          </Camera>
          <Button className='primary' onClick={handleShot}>
            Take shot
          </Button>
        </Wrapper>
        <Wrapper>
          <Camera>
            uploaded snapshot shows here
            <Canvas ref={canvas} />
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
                <Button className='green' onClick={handleClearShot}>
                  Save
                </Button>
              </Download>
            )}
          </ButtonGroup>
        </Wrapper>
      </Flex>
    </Layout>
  )
}

export default Profile
