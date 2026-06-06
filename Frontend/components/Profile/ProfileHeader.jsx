import { ProfileNav } from './ProfileNav';
import { useProfile } from './ProfileContext';
import styles from '../../src/styles/Profile.module.css';

export function ProfileHeader() {
  const profile = useProfile();
  if (!profile) {
    return(
      <h3>Sorry, this user doesn't exist.</h3>
    )
  }

  return(
    <>
      <div className={styles.profile_container}>
        <div className={styles.sub_profile_container}>
          <div id={styles.profile_picture_container}>
            <img src={profile.avatarUrl} id={styles.profile_picture} />
          </div>
          <div className={styles.name_container}>
            <span id={styles.display_name}>{profile.name}</span>
            <span id={styles.handle_display}>@{profile.username}</span>
            <span id={styles.handle_display}>{profile.login} - {profile.pronouns}</span>
            <span>{profile.bio}</span>
            <span>{profile.followers} followers • {profile.following} following</span>
          </div>
        </div>
        <div>
          <ProfileNav />
        </div>
      </div>
    </>
  )
}
