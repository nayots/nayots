import React from "react";
import styles from "./header.module.scss";

export const Header: React.FC<{}> = (props): JSX.Element => {
  return <div className={styles.headerRoot}>Header here</div>;
};

export default Header;
