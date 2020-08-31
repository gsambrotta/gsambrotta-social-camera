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

  // NOTE: This function is not used, I implemented for the sake of showing
  // how to get and download an image from S3, as requested in the task description.
  // I personally think is better to use the shot we already have in memory
  // and doing so we avoid another request improving performance.
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

      const json = await res.json()
      if (json.ok) {
        browser.downloads.download({
          url: getSignedUrl,
          filename: 'girbill-avatar.jpg'
        })
      } else {
        console.log('error getting the shot')
      }
    } catch (err) {
      // Note: ideally here a better error handling
      console.log('error')
    }
  }

  useEffect(() => {
    if (shot === null) return

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
            contentType: 'image/jpg'
          }),
        })

        const { putSignedUrl } = await res.json()
        if (putSignedUrl) {
          return await uploadShot(putSignedUrl)
        } else {
          console.log('error fetching put presignedurl')
        }

      } catch (err) {
        // Note: ideally here a better error handling
        console.log('error')
      }
    }

    fetchPutSignedUrl()
  }, [shot])

  async function uploadShot(putSignedUrl) {
    const buffer = Buffer.from(shot.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    try {
      const res = await fetch(putSignedUrl, {
        method: 'PUT',
        mode: 'cors',
        body: buffer,
        headers: {
          'Content-Type': 'image/jpeg',
          'Content-Encoding': 'base64',
        }
      })
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
  }

  function handleClearShot() {
    const context = canvas.current.getContext('2d')
    context.clearRect(0, 0, CAMERA_WIDTH, CAMERA_HEIGHT)
    setShot(null)
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
