import React, { useState, useEffect, useContext } from "react";
import NavBar from "./common/navbar";
import SideBar from "./common/sidebar";
import Cart from "../containers/Cart";
import CartContainer from "../containers/CartContainer";
import TopBarDark from "./common/topbar-dark";
import { Media, Container, Row, Col } from "reactstrap";
import LogoImage from "./common/logo";
import search from "../../public/assets/images/icon/search.png";
import settings from "../../public/assets/images/icon/setting.png";
import cart from "../../public/assets/images/icon/cart.png";
import Currency from "./common/currency";
import { useRouter } from "next/router";
import SearchOverlay from "./common/search-overlay";
import UserContext from "../../helpers/user/UserContext";
import PrivateRoute from "../../routes/PrivateRoute";

const HeaderOne = ({
  logoName,
  headerClass,
  topClass,
  noTopBar,
  direction,
}) => {
  const router = useRouter();
  const userContext = useContext(UserContext);

  /*=====================
     Pre loader
     ==========================*/
  useEffect(() => {
    setTimeout(function () {
      document.querySelectorAll(".loader-wrapper").style = "display:none";
    }, 2000);

    if (router.asPath !== "/layouts/Christmas")
      window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    let number =
      window.pageXOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    if (number >= 300) {
      if (window.innerWidth < 581)
        document.getElementById("sticky").classList.remove("fixed");
      else document.getElementById("sticky").classList.add("fixed");
    }
    else document.getElementById("sticky").classList.remove("fixed");
  };

  const openNav = () => {
    var openmyslide = document.getElementById("mySidenav");
    if (openmyslide) {
      openmyslide.classList.add("open-side");
    }
  };
  
  const [openSearchOverlay, setOpenearchOverlay] = useState(false);
  const openSearch = () => {
    setOpenearchOverlay(true);
    // document.getElementById("search-overlay").style.display = "block";
  };

  // eslint-disable-next-line
  const load = () => {
    setIsLoading(true);
    fetch().then(() => {
      // deal with data fetched
      setIsLoading(false);
    });
  };

  useEffect(() => {
    // if(localStorage.getItem("token")){

      userContext.getAuth()
    // }
  }, [])

  return (
    <div>
      <header id="sticky" className={`sticky ${headerClass}`}>
        <div className="mobile-fix-option"></div>
        {/*Top Header Component*/}
        {noTopBar ? "" :<TopBarDark topClass={topClass} />}

        <Container>
          <Row>
            <Col>
              <div className="main-menu">
                <div className="menu-left">
                  <div className="navbar">
                    <a href={null} onClick={openNav}>
                      <div className="bar-style">
                        {/* <i
                          className="fa fa-bars sidebar-bar"
                          aria-hidden="true"
                        ></i> */}
                      </div>
                    </a>
                    {/*SideBar Navigation Component*/}
                    <SideBar />
                  </div>
                  <div className="brand-logo">
                    <LogoImage logo={logoName} />
                  </div>
                </div>
                <div className="menu-right pull-right">
                
                  {/* {
                    !userContext.loadingCategories  ?
                  <NavBar />
                  :
                  <>
                  <div class="skeleton-text d-none d-md-block"></div>
                  <div className="container d-block d-md-none spinnerNav"></div>
                  </>
                  } */}

                  <NavBar />
                  
                  <div>
                    <div className="icon-nav">
                      <ul>
                        <li className="onhover-div mobile-search">
                          <div className="mx-sm-3 mx-xl-0 me-xl-3">
                            <Media
                              src={search.src}
                              onClick={openSearch}
                              className="img-fluid"
                              alt=""
                            />
                            <i
                              className="fa fa-search"
                              onClick={openSearch}
                            ></i>
                          </div>
                        </li>
                        {/* <Currency icon={settings.src} /> */}

                        {userContext.authenticated &&
                        direction === undefined ? (
                          <CartContainer layout={direction} icon={cart.src} />
                        ) : userContext.authenticated &&
                          direction != undefined ? (
                          <Cart layout={direction} icon={cart.src} />
                        ) : (
                          <></>
                        )}

                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </header>
      {
        openSearchOverlay &&
        <SearchOverlay setOpenearchOverlay={setOpenearchOverlay}/>
      }
    </div>
  );
};

export default HeaderOne;
