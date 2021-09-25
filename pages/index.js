import React, { useState, useEffect } from "react"
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import StreamerGrid from '../components/StreamerGridComp'

const Home = () => {

  useEffect(() => {
    console.log("Fetching Channels...")
    fetchChannels()
  }, [])

  const [favoriteChannels, setFavoriteChannels] = useState([])

  const fetchChannels = async () => {
    try {
      const path = `https://${window.location.hostname}`

      const response = await fetch(`${path}/api/database`, {
        method: "POST",
        body: JSON.stringify({
          action: 'GET_CHANNELS',
          key: 'CHANNELS',
        })
      })

      if (response.status === 404) {
        console.log('Channels key could not be found')
      }

      const json = await response.json()

      if (json.data) {
        const channelNames = json.data.split(',')

        console.log("Channe; Names:", channelNames)

        const channelData = []

        for await (const channelName of channelNames) {
          console.log("Getting Twitch Data for:", channelName)

          const channelResp = await fetch(`${path}/api/twitch`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              data: channelName
            })
          })

          const json = await channelResp.json()

          if (json.data) {
            channelData.push(json.data)
            console.log(channelData)
          }
        }

        setFavoriteChannels(channelData)


      }

      
    }
    catch (error) {
      console.warn(error.message)
    }
  }

  const addStreamChannel = async (event) => {
    event.preventDefault()
    const { value } = event.target.elements.name
    if (value) {
      console.log("Value:", value)

      const path = `https://${window.location.hostname}`

      const response = await fetch(`${path}/api/twitch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({data: value})
      })

      const json = await response.json()
      console.log("From server:", json.data)


      setFavoriteChannels(prevState => [...prevState, json.data])

      await setChannels(value)

      event.target.elements.name.value = ""
    }
    
  }

  const setChannels = async channelName => {
    try {
      const currentStreamers = favoriteChannels.map(channel => channel.display_name.toLowerCase())

      const streamerList = [...currentStreamers, channelName].join(",")
console.log("Issue setting database0")
      const path = `https://${window.location.hostname}`
console.log("Issue setting database 1")
      const response = await fetch(`${path}/api/database`, {
        method: "POST",
        body: JSON.stringify({
          key: 'CHANNELS',
          value: streamerList
        })
      })
console.log("Issue setting database2")
      if (response.status === 200) {
        console.log(`Set ${channelName} in DB`)
      }
      else{
        console.log("Issue setting database")
      }
    }
    catch(error) {
      console.warn(error.message)
    }
  }

  const renderForm = () => (
    <div className={styles.formContainer}>
      <form onSubmit={addStreamChannel}>
        <input id="name" placeholder="Twitch Channel Name" type="text" required/>
        <button type="submit">Add Streamer</button>
      </form>
    </div>
  )

  return (
    <div className={styles.container}>
      <Head>
        <title>🎥 Personal Twitch Dashboard</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className={styles.inputContainer}>
        <h1>Welcome to the Personalized Twitch Dashboard! 🎉</h1>
        {renderForm()}
        <div> {favoriteChannels.join(",")}</div>
        <StreamerGrid channels={favoriteChannels} setChannels={setFavoriteChannels}/>
      </div>
    </div>
  )
}

export default Home