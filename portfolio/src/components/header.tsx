import { Link } from "gatsby";
import React from "react";

export interface IHeaderProps {
  siteTitle: string;
}

const Header: React.FC<IHeaderProps> = ({ siteTitle }) => <header></header>;

export default Header;
