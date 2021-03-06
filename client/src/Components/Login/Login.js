/**
 * @author Vali Shaik <vl216084@dal.ca>
 */
import React, { useState, useContext, useEffect } from "react";
import SocialMedia from "../SignUp/SocialMedia";
import { UserContext } from "../../Context/userContext";
import { withRouter } from "react-router-dom";
import * as firebase from "firebase/app";
import "firebase/auth";
import { AuthContext } from "../../App";

import {
  TextField,
  Button,
  FormGroup,
  FormHelperText,
} from "@material-ui/core";
import "./Login.css";
import NewUser from "./NewUser";
const Login = ({ history, loginShow }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(" ");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(" ");
  const [error, setErrors] = useState("");
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    if (email) {
      validateEmailForm();
    }
  }, [email]);
  useEffect(() => {
    if (password) {
      validatePasswordForm();
    }
  }, [password]);

  //Handling user sign in using firebase
  const handleSubmit = (event) => {
    event.preventDefault();
    //Checking for valid email and password
    if (emailError.length === 0 && passwordError.length === 0) {
      event.preventDefault();
      //Firebase API call
      firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(() => {
          firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((res) => {
              if (res.user) {
                //On successful login, fetching user properties and setting it to Context
                firebase.auth().onAuthStateChanged(function (user) {
                  if (user) {
                    // User is signed in.
                    setUser(user.displayName);
                    localStorage.setItem("user", user.displayName);
                  } else {
                    // No user is signed in.
                  }
                });
                Auth.setLoggedIn(true);
                loginShow(false);
                localStorage.setItem("user", res.user.displayName);
                //Displaying home page to the user
                history.push("/home");
              }
            })
            .catch((event) => {
              setErrors(event.message);
            });
        });
    } else {
      validateEmailForm();
      validatePasswordForm();
    }
  };

  const validEmailRegex = RegExp(
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/
  );

  const validateEmailForm = () => {
    if (!email) {
      setEmailError("* email id cannot be empty");
    } else if (!validEmailRegex.test(email)) {
      setEmailError("* Email is not valid");
    } else {
      setEmailError("");
    }
  };

  const validatePasswordForm = () => {
    if (password.length === 0) {
      setPasswordError("* password cannot be empty");
    } else {
      setPasswordError("");
    }
  };
  const Auth = useContext(AuthContext);
  return (
    <div className="LoginHomePage">
      <div>
        <NewUser />
      </div>
      <div className="Login row">
        <h4 className="Title">Log In</h4>
        <form>
          <FormHelperText id="my-helper-text">
            <span className="ErrorText">{error}</span>
          </FormHelperText>
          <FormGroup>
            <TextField
              id="emailInput"
              label="Email"
              variant="outlined"
              aria-describedby="my-helper-text"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
                validateEmailForm();
              }}
              onBlur={validateEmailForm}
              className={emailError.length > 0 ? "errorTextField" : ""}
            />
            <FormHelperText id="my-helper-text">
              <span className="ErrorText">{emailError}</span>
            </FormHelperText>
          </FormGroup>
          <FormGroup>
            <TextField
              id="passwordInput"
              label="Password"
              variant="outlined"
              aria-describedby="my-helper-text"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
                validatePasswordForm();
              }}
              onBlur={validatePasswordForm}
              type="password"
            />
            <FormHelperText id="my-helper-text">
              <span className="ErrorText">{passwordError}</span>
            </FormHelperText>
          </FormGroup>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Login
          </Button>
          <br></br>
          <br></br>
          <FormGroup>
            <a href="forgotPassword">Forgot Password?</a>
          </FormGroup>
        </form>
        <br></br>
        <div className="LoginBottom">
          <h6 className="NormalText">or Login with </h6>
          <div>
            <SocialMedia />
          </div>
        </div>
      </div>
    </div>
  );
};
export default withRouter(Login);
