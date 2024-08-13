import Button from "../../components/Button";
import { IButtonProps } from "../../components/Button/props";
import IconGoogle from "../../assets/images/icon-google.svg";
import IconFacebook from "../../assets/images/icon-facebook.svg";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
function Login() {
  const navigate = useNavigate();
  const { setUser }: any = useAuth();
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("User info:", user);
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/");
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };
  const data: IButtonProps[] = [
    {
      text: `Đăng nhập bằng Google`,
      icon: IconGoogle,
      className: "my-2",
      onClick: handleLogin,
    },
    {
      text: `Đăng nhập bằng Facebook`,
      icon: IconFacebook,
      className: "my-2",
      onClick: handleLogin,
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
