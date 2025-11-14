// src/layouts/AuthLayout/AuthLayout.jsx
import { Outlet } from "react-router-dom";
import LogoDark from "../../assets/images/logo-dark.png";
import LogoLight from "../../assets/images/logo-light.png";
import MainImage from "../../assets/images/small/img-10.jpg";

export default function AuthLayout() {
  return (
    <div>
      <div className="d-flex flex-column h-100 p-3">
        <div className="d-flex flex-column flex-grow-1">
          <div className="row h-100">
            <div className="col-xxl-7">
              <div className="row justify-content-center h-100">
                <div className="col-lg-6 py-lg-5">
                  <div className="d-flex flex-column h-100 justify-content-center">
                    <div className="auth-logo mb-4">
                      <a href="/" className="logo-dark">
                        <img src={LogoDark} height="24" alt="logo dark" />
                      </a>

                      <a href="/" className="logo-light">
                        <img src={LogoLight} height="24" alt="logo light" />
                      </a>
                    </div>
                    <div></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xxl-5 d-none d-xxl-flex">
              <div className="card h-100 mb-0 overflow-hidden">
                <div className="d-flex flex-column h-100">
                  <img src={MainImage} alt="" className="w-100 h-100" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-scroller">
        <div className="container-fluid page-body-wrapper full-page-wrapper">
          <div className="content-wrapper d-flex align-items-stretch auth auth-img-bg">
            <div className="row flex-grow">
              <div className="col-lg-6 d-flex align-items-center justify-content-center">
                <Outlet />
              </div>
              <div className="col-lg-6 login-half-bg d-flex flex-row">
                <p className="text-white font-weight-medium text-center flex-grow align-self-end">
                  Copyright &copy; 2025 All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
