import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { displayLogin } from "../reducers/headerSlice";
import Success from "./Success";
import { axiosAuth } from "../configurations/axiosConfig";

export default function SignUp() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [cpassword, setCpassword] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    const [emailError, setEmailError] = useState('');
    const [pswdError, setPswdError] = useState('');
    const [cpswdError, setCpswdError] = useState('');
    const [showTermsWarning, setShowTermsWarning] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showCPassword, setShowCPassword] = useState(false);
    const [signupError, setSignupError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                navigate("/");
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [navigate, dispatch]);

    function emailValidation() {
        if (!emailRegex.test(username)) {
            setEmailError('Please enter a valid email address');
            return false;
        }
        setEmailError('');
        return true;
    }

    function pswdValidation() {
        if (!passwordRegex.test(password)) {
            setPswdError('Min. 6 characters, 1 lowercase, 1 uppercase, 1 number and 1 special character from @$!%*?&');
            return false;
        }
        setPswdError('');
        return true;
    }

    function cpswdValidation() {
        if (cpassword !== password) {
            setCpswdError('Password mismatch');
            return false;
        }
        setCpswdError('');
        return true;
    }

    function registerUser() {
        const isEmailValid = emailValidation();
        const isPswdValid = pswdValidation();
        const isCpswdValid = cpswdValidation();

        if (!isEmailValid || !isPswdValid || !isCpswdValid) return;
        else if (!isChecked) {
            setShowTermsWarning('Please agree to the terms before registering.');
            return;
        }

        setShowTermsWarning('');
        const signupPayload = {
            email: username.toLowerCase(),
            password: password,
        };

        axiosAuth
            .post('saveuser', signupPayload)
            .then((response) => {
                if (response.status === 201) {
                    setShowSuccess(true);
                }
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.status === 400) setSignupError('Error in creating an account')
                    else if (error.response.status === 409) setSignupError('User with this email already exists')
                }
                else setSignupError('Server not reachable');
            });
    }

    function handleSubmit(e) {
        e.preventDefault();
        registerUser();
    }

    return (
        <div className="popup">
            <div className="login-page">
                <form onSubmit={(e) => handleSubmit(e)}>
                    <h1>Sign up</h1>
                    <div class="inputbox">
                        <ion-icon name="mail-outline"></ion-icon>
                        <input type="email" required value={username}
                            onChange={(e) => setUsername(e.target.value)} onBlur={() => emailValidation()}
                            className={` ${username ? 'has-content' : ''}`} />
                        <label htmlFor="">Email</label>
                        {emailError && <span className="error-text">{emailError}</span>}
                    </div>
                    <div class="inputbox">
                        <ion-icon name="lock-closed-outline"></ion-icon>
                        <input type={showPassword ? 'text' : 'password'} required value={password}
                            onChange={(e) => setPassword(e.target.value)} onBlur={() => pswdValidation()}
                            className={` ${password ? 'has-content' : ''}`} />
                        <label htmlFor="">Password</label>
                        <span className="toggle-password" onClick={() => setShowPassword(prev => !prev)}>
                            {showPassword ? 'hide' : 'show'}
                        </span>
                        {pswdError && <span className="error-text">{pswdError}</span>}
                    </div>
                    <div class="inputbox">
                        <ion-icon name="lock-closed-outline"></ion-icon>
                        <input type={showCPassword ? 'text' : 'password'} required value={cpassword}
                            onChange={(e) => setCpassword(e.target.value)} onBlur={() => cpswdValidation()}
                            className={` ${cpassword ? 'has-content' : ''}`} />
                        <label htmlFor="">Confirm Password</label>
                        <span className="toggle-password" onClick={() => setShowCPassword(prev => !prev)}>
                            {showCPassword ? 'hide' : 'show'}
                        </span>
                        {cpswdError && <span className="error-text">{cpswdError}</span>}
                    </div>
                    <div>
                        <label htmlFor=""><input type="checkbox" checked={isChecked}
                            onChange={(e) => { setIsChecked(e.target.checked); if (e.target.checked) setShowTermsWarning(''); }} />I agree to all terms</label>
                        {showTermsWarning && <span className="error-text" style={{ marginTop: '4px' }}>{showTermsWarning}</span>}

                    </div>
                    <button type='submit' className='log-btn' onClick={() => registerUser()}>Register</button>
                    {signupError && <span className="error-text">{signupError}</span>}
                    <div class="register">
                        <p onClick={() => dispatch(displayLogin())}>Already have an account?  <Link to='/login'>Sign In</Link></p>
                    </div>
                </form>
                {showSuccess && (
                    <Success
                        header="You're in!"
                        message="Registration was a success. Enjoy exploring."
                        onConfirm={() => {
                            setShowSuccess(false);
                            dispatch(displayLogin());
                            navigate('/login');
                        }}
                    />
                )}
            </div>
        </div>
    );
}