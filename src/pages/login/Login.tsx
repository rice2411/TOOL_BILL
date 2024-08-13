import Button from "../../components/Button";
import { IButtonProps } from "../../components/Button/props";
import IconGoogle from "../../assets/images/icon-google.svg";
import IconFacebook from "../../assets/images/icon-facebook.svg";
import { signInWithPopup } from "firebase/auth";
import {
  auth,
  googleProvider,
  facebookProvider,
} from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Login(this: any) {
  const navigate = useNavigate();
  const { setUser }: any = useAuth();
  const handleLogin = async (provider: any) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User info:", user);
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/");
    } catch (error) {
      console.error("Error ", error);
    }
  };
  const data: IButtonProps[] = [
    {
      text: `Đăng nhập bằng Google`,
      icon: IconGoogle,
      className: "my-2",
      onClick: () => {
        handleLogin(googleProvider);
      },
    },
    {
      text: `Đăng nhập bằng Facebook`,
      icon: IconFacebook,
      className: "my-2",
      onClick: () => {
        handleLogin(facebookProvider);
      },
    },
  ];

  return (
    <>
      {data.map((props, index) => (
        <Button {...props} key={index} />
      ))}
    </>
  );
}

export default Login;
