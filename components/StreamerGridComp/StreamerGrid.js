import React from 'react'
import Image from 'next/image'
import styles from '../../styles/StreamerGrid.module.css'

const StreamerGrid = ({ channels }) => {
  return (
    <div>
      <h2>{`Kev's Twitch Dashboard`}</h2>
      {channels.map(renderGridItem)}
    </div>
  )
}

const renderGridItem = channel => (
  <div key={channel.id} className={styles.gridItem}>
    <Image layout="fill" src={channel.thumbnail_url} />
    <div className={styles.gridItemContent}>
      <p>{channel.display_name}</p>
      {channel.is_live && <p>Live Now!</p>}
      {!channel.is_live && <p>Offline</p>}
    </div>
  </div>
)



export default StreamerGrid