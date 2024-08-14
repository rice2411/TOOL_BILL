import Button from "../../components/Button";
import { IButtonProps } from "../../components/Button/props";
import IconGoogle from "../../assets/images/icon-google.svg";
import IconFacebook from "../../assets/images/icon-facebook.svg";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { IAuthContext, IUser } from "../../interface";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth() as unknown as IAuthContext;
  const handleLogin = async (providerString: string) => {
    try {
      const result = await signInWithPopup(
        auth,
        provider[providerString as keyof typeof provider]
      );
      const user: IUser = JSON.parse(JSON.stringify(result.user));
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
        handleLogin("google");
      },
    },
    {
      text: `Đăng nhập bằng Facebook`,
      icon: IconFacebook,
      className: "my-2",
      onClick: () => {
        handleLogin("facebook");
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
