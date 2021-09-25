// This is where all the logic for your Twitch API will live!
const HOST_NAME = "https://api.twitch.tv/helix"

export default async (req, res) => {
  // res.status(200).json({data: 'Welcome to Twitch API!'})
  try {
    if (req.method === "POST") {
      const { data } = req.body

      const channelData = await getTwitchChannel(data)
      if (channelData) {
        console.log("Channel Data:", channelData)
        res.status(200).json({ data: channelData })
      }
      res.status(404).send()
    }
  } catch(error) {
    console.warn(error.message)
    res.status(500).send()
  }
}

const getTwitchChannel = async channelName => {
  console.log("Searching for Twitch Channel...")
  if (channelName) {
    const accessToken = await getTwitchAccessToken()
    if (accessToken) {
      const response = await fetch(`${HOST_NAME}/search/channels?query=${channelName}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Client-Id": process.env.TWITCH_CLIENT_ID
        }
      })

      const json = await response.json()

      if (json.data) {
        const { data } = json
        const lowercaseChannelName = channelName.toLowerCase()
        const foundChannel = data.find(channel => {
          const lowercaseDisplayName = channel.display_name.toLowerCase()
          return lowercaseChannelName === lowercaseDisplayName
        })

        return foundChannel
      }

      throw new Error("Twitch accessToken was undefined.")
    }

    throw new Error("No channelName provided.")
  }
}

const getTwitchAccessToken = async () => {
  console.log("GETTING ACCESS TOKEN...")
  const path = `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_SECRET_ID}&grant_type=client_credentials`

  const response = await fetch(path, {
    method: "POST"
  })

  if (response) {
    const json = await response.json()
    return json.access_token
  }
}