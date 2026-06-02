import { ProfileNav } from './ProfileNav'
import styles from '../styles/Profile.module.css'

export function Profile() {
  const exampleProfile = {
    name: "Davin Til",
    username: "djurigd",
    avatar_url: "https://avatars.githubusercontent.com/u/182570390?v=4",
    followers: 3,
    following: 3,
    pronouns: "he/him",
    bio: "Just testing out."
  };

  return(
    <>
      <div className={styles.profile_container}>
        <div id={styles.profile_picture_container}>
          <img src={exampleProfile.avatar_url} id={styles.profile_picture} />
        </div>
        <div className={styles.name_container}>
          <span id={styles.display_name}>{exampleProfile.name}</span>
          <span>{exampleProfile.username} - <span>{exampleProfile.pronouns}</span></span>
          <span>{exampleProfile.followers} followers / {exampleProfile.following} following</span>
        </div>
      </div>
      <ProfileNav />
    </>
  )
}