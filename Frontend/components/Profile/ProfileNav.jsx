import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from '../../src/styles/ProfileNav.module.css'

export function ProfileNav() {
  const [page, setPage] = useState({});
  const { username } = useParams();

  const pages = [
    { to: `/profile/${username}`, page: "Posts" },
    { to: `/profile/${username}/projects`, page: "Projects" }
  ];
  return(
    <>
      <nav className={styles.profile_nav}>
        <ul>
          {pages.map((link, id) => (
            <li key={id} 
                className={styles.nav_button} 
                id={page === id? "current" : ""}>
                    <Link to={link.to} 
                        id={page === id ? "current" : ""} 
                        onClick={() => setPage(id)}>
                          {link.page}
                    </Link>
              </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
