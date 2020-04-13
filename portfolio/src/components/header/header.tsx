import React from "react";
import styles from "./header.module.scss";

export const Header: React.FC<{}> = (props): JSX.Element => {
  return (
    <div className={styles.headerRoot}>
      <div className={styles.navList}>
        <div className={styles.logo}>
          <img
            src="https://res.cloudinary.com/fehbot/image/upload/v1586806555/portfolio/Stoyan_Grigorov_logo-small.png"
            alt="logo"
          />
        </div>
        <div>Stoyan Grigorov</div>
      </div>
    </div>
  );
};

export default Header;
