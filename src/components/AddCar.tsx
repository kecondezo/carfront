import {useState} from "react";
import {Car} from "../types.ts";
import {Button, Dialog, DialogActions, DialogTitle} from "@mui/material";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {addCar} from "../api/carapi.ts";
import CarDialogContent from "./CarDialogContent.tsx";

function AddCar() {
    const queryClient = useQueryClient();
    const {mutate} = useMutation({
        mutationFn: addCar,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["cars"]});
        },
        onError: (err) => {
            console.error(err);
        }
    })
    const [open, setOpen] = useState(false);
    const [car, setCar] = useState<Car>(
        {
            brand: '',
            model: '',
            modelYear: 0,
            color: '',
            registrationNumber: '',
            price: 0,
        }
    );
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCar({...car, [event.target.name]: event.target.value});
    }
    const handleSave = () => {
        mutate(car);
        setCar({
            brand: '',
            model: '',
            modelYear: 0,
            color: '',
            registrationNumber: '',
            price: 0,
        });
        handleClose();
    }
    return <>
        <Button onClick={handleClickOpen}>Add Car</Button>
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>New Car</DialogTitle>
            <CarDialogContent car={car} handleChange={handleChange} />
            <DialogActions>
                <Button onClick={handleClose}> Cancel</Button>
                <Button onClick={handleSave}> Save</Button>
            </DialogActions>
        </Dialog>
    </>
}

export default AddCar;