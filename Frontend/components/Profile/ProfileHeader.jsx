import { ProfileNav } from './ProfileNav';
import { useProfile } from './ProfileContext';

import styles from '../styles/Profile.module.css';

export function ProfileHeader() {
  const { username, avatarUrl, name, login, pronouns, bio, followers, following } = useProfile();

  return(
    <>
      <div className={styles.profile_container}>
        <div className={styles.sub_profile_container}>
          <div id={styles.profile_picture_container}>
            <img src={avatarUrl} id={styles.profile_picture} />
          </div>
          <div className={styles.name_container}>
            <span id={styles.display_name}>{name}</span>
            <span id={styles.handle_display}>@{username}</span>
            <span id={styles.handle_display}>{login} - {pronouns}</span>
            <span>{bio}</span>
            <span>{followers} followers • {following} following</span>
          </div>
        </div>
        <div>
          <ProfileNav />
        </div>
      </div>
    </>
  )
}