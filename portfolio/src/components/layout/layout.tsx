import React from "react";
import Header from "../header/header";
import styles from "./layout.module.scss";

export const Layout: React.FC<{}> = ({ children }): JSX.Element => {
  return (
    <React.Fragment>
      <Header />
      <div className={styles.mainContent}>{children}</div>
    </React.Fragment>
  );
};

export default Layout;
