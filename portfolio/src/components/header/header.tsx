import React from "react";
import styles from "./header.module.scss";

export const Header: React.FC<{}> = (props): JSX.Element => {
  return (
    <div className={styles.headerRoot}>
      <div className={styles.navList}>
        <div className={styles.logo}>
          <img
            src="https://res.cloudinary.com/fehbot/image/upload/c_scale,h_300/v1586104852/portfolio/stoyan-grigorov-logo.svg"
            alt="logo"
          />
        </div>
        <div>Stoyan Grigorov</div>
      </div>
    </div>
  );
};

export default Header;
