import { ProfileHeader } from "../../components/Profile/ProfileHeader";
import { useParams, Outlet } from "react-router-dom";
import { ProfileProvider } from "../../components/Profile/ProfileProvider";
import { useProfile } from "../../components/Profile/ProfileContext";
import { PostProvider } from "../../components/ProfilePosts/PostProvider";
import { ProjectProvider } from "../../components/ProfileProjects/ProjectProvider"

function CheckProfile() {
  const { login } = useProfile();
  
  if (!login) {
    return null;
  }

  return <Outlet />
}

export function Profile() {
  const { username } = useParams();

  return(
    <ProfileProvider username={username}>
      <PostProvider username={username}>
        <ProjectProvider>
          <ProfileHeader />
          <CheckProfile />
        </ProjectProvider>
      </PostProvider>
    </ProfileProvider>
  )
}

export default Profile
