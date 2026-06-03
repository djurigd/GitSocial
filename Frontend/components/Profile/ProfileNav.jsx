import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../src/styles/ProfileNav.module.css'

export function ProfileNav() {
  const [page, setPage] = useState({});

  const pages = [
    { to: "/", page: "Posts" },
    { to: "/projects", page: "Projects" }
  ];
  return(
    <>
      <nav>
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