import { useState } from "react";
import styled from "styled-components";
import useShowToast from "../hooks/useShowToast";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { Spinner } from "@chakra-ui/react";

const SignupCard = () => {
  const [logininputs, setInputsforlogin] = useState({
    username: "",
    password: "",
  });
  const [signupinputs, setInputsforsingup] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const showToast = useShowToast();
  const setUser = useSetRecoilState(userAtom);
  const [loading, setLoading] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(logininputs);
    setLoading(true);
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logininputs),
      });
      const data = await res.json();
      console.log("data after login: ", data);
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      localStorage.setItem("user-threads", JSON.stringify(data));
      setUser(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent default form submission
    // if (!inputs.name || !inputs.username || !inputs.email || !inputs.password) {
    //   alert("Please fill in all fields!");
    //   return;
    // }
    console.log("signup inputs: ", signupinputs);
    setLoading(true);
    try {
      const res = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupinputs),
      });
      const data = await res.json();
      console.log("after post req: ", data);

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      localStorage.setItem("user-threads", JSON.stringify(data));
      setUser(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledWrapper>
      <div className="wrapper">
        <div className="card-switch">
          <label className="switch">
            <input type="checkbox" className="toggle" />
            <span className="slider" />
            <span className="card-side" />
            <div className="flip-card__inner">
              <div className="flip-card__front">
                <div className="title">Log in</div>
                <form className="flip-card__form" onSubmit={handleLogin}>
                  <input
                    className="flip-card__input"
                    name="username"
                    placeholder="Username"
                    value={logininputs.username}
                    onChange={(e) =>
                      setInputsforlogin((logininputs) => ({
                        ...logininputs,
                        username: e.target.value,
                      }))
                    }
                    type="text"
                  />
                  <input
                    className="flip-card__input"
                    name="password"
                    placeholder="Password"
                    value={logininputs.password}
                    onChange={(e) =>
                      setInputsforlogin((logininputs) => ({
                        ...logininputs,
                        password: e.target.value,
                      }))
                    }
                    type="password"
                  />
                  <button className="flip-card__btn">
                    {loading ? <Spinner size={"l"} /> : "Let`s go!"}
                  </button>
                </form>
              </div>
              <div className="flip-card__back">
                <div className="title">Sign up</div>
                <form className="flip-card__form" onSubmit={handleSignup}>
                  <input
                    className="flip-card__input"
                    placeholder="Name"
                    onChange={(e) =>
                      setInputsforsingup({
                        ...signupinputs,
                        name: e.target.value,
                      })
                    }
                    value={signupinputs.name}
                    type="text"
                  />
                  <input
                    className="flip-card__input"
                    name="username"
                    placeholder="Username"
                    onChange={(e) =>
                      setInputsforsingup({
                        ...signupinputs,
                        username: e.target.value,
                      })
                    }
                    value={signupinputs.username}
                    type="text"
                  />
                  <input
                    className="flip-card__input"
                    name="email"
                    placeholder="Email"
                    onChange={(e) =>
                      setInputsforsingup({
                        ...signupinputs,
                        email: e.target.value,
                      })
                    }
                    value={signupinputs.email}
                    type="email"
                  />

                  <input
                    className="flip-card__input"
                    name="password"
                    placeholder="Password"
                    onChange={(e) =>
                      setInputsforsingup({
                        ...signupinputs,
                        password: e.target.value,
                      })
                    }
                    value={signupinputs.password}
                    type="password"
                  />
                  <button className="flip-card__btn" type="submit">
                    Confirm!
                  </button>
                </form>
              </div>
            </div>
          </label>
        </div>
      </div>
    </StyledWrapper>
  );
};
//worked selfed --prajwal card embeded
const StyledWrapper = styled.div`
  .wrapper {
    --input-focus: #2d8cf0;
    --font-color: #323232;
    --font-color-sub: #666;
    --bg-color: #fff;
    --bg-color-alt: #666;
    --main-color: #323232;
    /* display: flex; */
    /* flex-direction: column; */
    /* align-items: center; */
  }
  /* switch card */
  .switch {
    transform: translateY(-200px);
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 30px;
    width: 50px;
    height: 20px;
  }

  .card-side::before {
    position: absolute;
    content: "Log in";
    left: -70px;
    top: 0;
    width: 100px;
    text-decoration: underline;
    color: var(--bg-mode) == light ? var(--card-text-color-light) : var(--card-text-color-dark);
    font-weight: 600;
  }

  .card-side::after {
    position: absolute;
    content: "Sign up";
    left: 70px;
    top: 0;
    width: 100px;
    text-decoration: none;
     color: var(--bg-mode) == light ? var(--card-text-color-light) : var(--card-text-color-dark);
    font-weight: 600;
  }

  .toggle {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    box-sizing: border-box;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    box-shadow: 4px 4px var(--main-color);
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--bg-colorcolor);
    transition: 0.3s;
  }

  .slider:before {
    box-sizing: border-box;
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    border: 2px solid var(--main-color);
    border-radius: 5px;
    left: -2px;
    bottom: 2px;
    background-color: var(--bg-color);
    box-shadow: 0 3px 0 var(--main-color);
    transition: 0.3s;
  }

  .toggle:checked + .slider {
    background-color: var(--input-focus);
  }

  .toggle:checked + .slider:before {
    transform: translateX(30px);
  }

  .toggle:checked ~ .card-side:before {
    text-decoration: none;
  }

  .toggle:checked ~ .card-side:after {
    text-decoration: underline;
  }

  /* card */

  .flip-card__inner {
    width: 300px;
    height: 350px;
    position: relative;
    background-color: transparent;
    perspective: 1000px;
    /* width: 100%;
      height: 100%; */
    text-align: center;
    transition: transform 0.8s;
    transform-style: preserve-3d;
  }

  .toggle:checked ~ .flip-card__inner {
    transform: rotateY(180deg);
  }

  .toggle:checked ~ .flip-card__front {
    box-shadow: none;
  }

  .flip-card__front,
  .flip-card__back {
    padding: 20px;
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    background: lightgrey;
    gap: 20px;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    box-shadow: 4px 4px var(--main-color);
  }

  .flip-card__back {
    width: 100%;
    transform: rotateY(180deg);
  }

  .flip-card__form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .title {
    margin: 20px 0 20px 0;
    font-size: 25px;
    font-weight: 900;
    text-align: center;
    color: var(--main-color);
  }

  .flip-card__input {
    width: 250px;
    height: 40px;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    background-color: var(--bg-color);
    box-shadow: 4px 4px var(--main-color);
    font-size: 15px;
    font-weight: 600;
    color: var(--font-color);
    padding: 5px 10px;
    outline: none;
  }

  .flip-card__input::placeholder {
    color: var(--font-color-sub);
    opacity: 0.8;
  }

  .flip-card__input:focus {
    border: 2px solid var(--input-focus);
  }

  .flip-card__btn:active,
  .button-confirm:active {
    box-shadow: 0px 0px var(--main-color);
    transform: translate(3px, 3px);
  }

  .flip-card__btn {
    margin: 20px 0 20px 0;
    width: 120px;
    height: 40px;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    background-color: var(--bg-color);
    box-shadow: 4px 4px var(--main-color);
    font-size: 17px;
    font-weight: 600;
    color: var(--font-color);
    cursor: pointer;
  }`;

export default SignupCard;
