import React, { useContext, useEffect, useState } from "react";
import ThemeSettings from "../components/customizer/theme-settings";
import "../public/assets/scss/app.scss";
import { ToastContainer } from "react-toastify";
import TapTop from "../components/common/widgets/Tap-Top";
// import MessengerCustomerChat from "react-messenger-customer-chat";
import CartContextProvider from "../helpers/cart/CartContext";
import { WishlistContextProvider } from "../helpers/wishlist/WishlistContext";
import FilterProvider from "../helpers/filter/FilterProvider";
import SettingProvider from "../helpers/theme-setting/SettingProvider";
import { CompareContextProvider } from "../helpers/Compare/CompareContext";
import { CurrencyContextProvider } from "../helpers/Currency/CurrencyContext";
import Helmet from "react-helmet";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../helpers/apollo";
import UserProvider from "../helpers/user/UserProvider";
import CommonLayout from "../components/shop/common-layout";
import "../public/assets/products.css"
import TimerProvider from "../helpers/timer/timerProvider";

export default function MyApp({ Component, pageProps }) {
  const [isLoading, setIsLoading] = useState(true);
  const [url, setUrl] = useState();
  const apolloClient = useApollo(pageProps);

  useEffect(() => {
    const path = window.location.pathname.split("/");
    const url = path[path.length - 1];
    document.body.classList.add("dark");

    let timer = setTimeout(function () {
      setIsLoading(false);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <ApolloProvider client={apolloClient}>
        {isLoading ? (
          <div className="loader-wrapper">{url === "Christmas" ? <div id="preloader"></div> : <div className="loader"></div>}</div>
        ) : (
          <>
            <Helmet>
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <link
          rel="icon"
          type="image/x-icon"
          href={"/assets/logo/A.png"}
        />
              <title>AINHOA</title>
            </Helmet>
            <div>
              <UserProvider>
                          <TimerProvider>
              <SettingProvider>
                <CompareContextProvider>
                  <CurrencyContextProvider>
                    <CartContextProvider>
                      <WishlistContextProvider>
                        <FilterProvider>
                            <CommonLayout><Component {...pageProps} /></CommonLayout> 
                        </FilterProvider>
                      </WishlistContextProvider>
                    </CartContextProvider>
                  </CurrencyContextProvider>
                  <ThemeSettings />
                </CompareContextProvider>
              </SettingProvider>
                          </TimerProvider>
              </UserProvider>
              <ToastContainer />
              <TapTop />
            </div>
          </>
        )}
      </ApolloProvider>
    </>
  );
}
