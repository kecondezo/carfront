import {useState} from "react";
import axios from "axios";
import {User} from "../types.ts";
import {Button, Snackbar, Stack, TextField} from "@mui/material";
import Carlist from "./Carlist.tsx";

function Login() {
    const [user, setUser] = useState<User>({
        username: '',
        password: '',
    });
    const [isAuthenticated, setAuthenticated] = useState<boolean>(false);
    const [open, setOpen] = useState(false)
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUser({...user, [event.target.name]: event.target.value});
    }
    const handleLogin = () => {
        axios.post(import.meta.env.VITE_API_URL + "/login", user, {
            headers: {'Content-Type': 'application/json'}
        })
            .then(res => {
                const jwtToken = res.headers.authorization;
                if (jwtToken !== null && jwtToken !== "") {
                    sessionStorage.setItem("jwt", jwtToken);
                    setAuthenticated(true);
                }
            })
            .catch(() => setOpen(true));
    }
    const handleLogout = () => {
        setAuthenticated(false);
        sessionStorage.removeItem("jwt")
    }
    if (isAuthenticated) {
        return <Carlist logOut={handleLogout} />
    } else {
        return (
            <Stack spacing={2} alignItems="center" mt={2}>
                <TextField
                    name="username"
                    label="Username"
                    onChange={handleChange}/>
                <TextField
                    name="password"
                    label="Password"
                    onChange={handleChange}/>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleLogin}>
                    Login
                </Button>
                <Snackbar
                    open={open}
                    autoHideDuration={3000}
                    onClose={() => setOpen(false)}
                    message="Login Failed, check your username and password"
                />
            </Stack>
        )
    }
}

export default Login