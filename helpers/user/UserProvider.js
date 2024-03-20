import React, { useEffect, useState } from "react";
import UserContext from "./UserContext";
import axios from "../../config/axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import useGet from "../../utils/useGet";

const UserProvider = (props) => {
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState(null);
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [botonState, setBotonState] = useState(false);

    const [products,loadingProducts,getProducts,setProducts] = useGet("/api/bff-store/products?page=1",axios)

    const router = useRouter();

    const login = async (values) => {
      setBotonState(true);
      try {
        console.log(values);
        const { data } = await axios.post("/api/bff-store/auth/login", values);
        console.log(data);
        setAuthenticated(!!data.user);
        setUser(data.user);
        setCart(data.cart)
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.access_token;
        localStorage.setItem("token", data.access_token);
        // localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/")

      } catch (error) {
        toast.error(error.response?.data.message || error.message);
        console.log(error.response.status);
      }
      setBotonState(false);
    };

    const getAuth = async () => {
      try {
       
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          router.push("/")
          return setAuthenticated(false);
        }
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        const { data } = await axios.get("/api/bff-store/private/auth/user");
       
        setUser(data.user);
        setAuthenticated(true);
        setCart(data.cart)
      } catch (error) {
        logout();
        setAuthenticated(false);
        router.push("/page/account/login")
        toast.error("Error de autenticación. Ingrese nuevamente");
        console.log(error);
      }
      setLoading(false);
    };

    const logout = async () =>{
      if(cart?.products.length > 0){
        
       await removeProductsFromCart()
      }

      setAuthenticated(false);
      localStorage.clear();
      router.push("/page/account/login");
      try {
        const {data} = await axios.post("/api/bff-store/private/auth/logout")
       
      } catch (error) {
        localStorage.clear();
        console.log(error);
      }
    }

    const register = async (values) =>{
      console.log(values);
      setBotonState(true);
      try {
        const { data } = await axios.post("/api/bff-store/customers/register", values);
        console.log(data);
        toast.success("Usuario registrado !")
        router.push("/page/account/login")
      } catch (error) {
        toast.error(error.response?.data.message || error.message);
        console.log(error.response.status);
      }
      setBotonState(false);
    }

    const addProductToCart = async (product,qty) => {
      try {
        if(cart?.products.find(p=>p.code ==product.code)){
          toast.error("El producto ya fue agregado al carrito");
        }else{
          const productToAdd = {"product": product.code,"qty":qty}
          const {data} = await axios.post("/api/bff-store/private/carts/products",productToAdd)
          console.log(data);
          toast.success("Producto agregado al carrito");
          setCart((prevCart) => ({
            ...prevCart,
            products: [...prevCart?.products, product]
          }));
        }
        getProducts();
      } catch (error) {
        console.log(error);
      }
    };

    const removeProductFromCart = async (code) => {
      try {
       const {data} = await axios.delete(`/api/bff-store/private/carts/products/${code}`)
        console.log(data);
        toast.error("Producto quitado del carrito");
        setCart((prevCart) => ({
          ...prevCart,
          products: prevCart.products.filter(product => product.code !== code)
        }));
        getProducts();
      } catch (error) {
        toast.error("Algo salió mal..");
      }
    };

    const removeProductsFromCart = async () => {
      try {

        setCart((prevCart) => ({
          ...prevCart,
          products: []
        }));

        for(const product of cart.products){
           await axios.delete(`/api/bff-store/private/carts/products/${product.code}`)
        }

        toast.error("Su tiempo de compra ha terminado..");
        
        getProducts();
      } catch (error) {
        toast.error("Algo salió mal..");
      }
    };

    const checkout = async (values)=>{
      setBotonState(true);
      try {
        console.log(values);
        const checkoutObj = {
          cart: cart.code,
          email: values.email,
          shipping_method: values. shipping_method,
          address_street: null,
          address_number: null,
          address_extra: null,
          address_city: null,
          address_state: null,
          address_zipcode: null
        }
        const { data } = await axios.post("/api/bff-store/private/carts/checkout", checkoutObj);
        console.log(data);
        toast.success("Gracias por su compra")
        router.push("/")
      } catch (error) {
        logout();
        toast.error(error.response?.data.message || error.message);
        console.log(error.response.status);
      }
      setBotonState(false);
    }

  return (
    <UserContext.Provider
      value={{
        ...props,
        user,
        setUser,
        authenticated,
        setAuthenticated,
        loading,
        setLoading,
        botonState,
        setBotonState,
        login,
        getAuth,
        logout,
        register,
        products,
        setProducts,
        cart,
        addProductToCart,
        removeProductFromCart,
        removeProductsFromCart,
        checkout
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserProvider;
