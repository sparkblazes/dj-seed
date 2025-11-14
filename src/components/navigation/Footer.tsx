import React from "react";
import { Icon } from "@iconify/react";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 text-center">
            <script>document.write(new Date().getFullYear())</script> &copy;
            <Icon icon="iconamoon:heart-duotone" className="fs-18 align-middle text-danger" />
            <a
              href="https://1.envato.market/techzaa"
              className="fw-bold footer-text"
              target="_blank"
            >
              Techzaa
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
