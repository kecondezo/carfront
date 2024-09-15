import {CarResponse, Car, CarEntry} from "../types.ts";
import {useState} from "react";
import {Button, Dialog, DialogActions, DialogTitle, IconButton, Tooltip} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CarDialogContent from "./CarDialogContent.tsx";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {upateCar} from "../api/carapi.ts";

type FormProps = {
    cardata: CarResponse;
}

function EditCar({cardata}: FormProps) {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [car, setCar] = useState<Car>({
        brand: '',
        model: '',
        color: '',
        registrationNumber: '',
        price: 0,
        modelYear: 0,
    });

    const handleClickOpen = () => {
        setCar({
            brand: cardata.brand,
            model: cardata.model,
            color: cardata.color,
            registrationNumber: cardata.registrationNumber,
            modelYear: cardata.modelYear,
            price: cardata.price,
        })
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleSave = () => {
        const url = cardata._links.self.href;
        const carEntry: CarEntry = {car, url}
        mutate(carEntry);
        setCar({brand: '', registrationNumber: '', color: '', price: 0, modelYear: 0, model: ''})
        setOpen(false)
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCar({
            ...car, [event.target.name]: event.target.value
        })
    }

    const {mutate} = useMutation({
        mutationFn: upateCar,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["cars"]});
        },
        onError: (err) => {
            console.error(err);
        }
    })
    return (
        <>
            <Tooltip title="Edit Car">
                <IconButton aria-label="edit" size="small" onClick={handleClickOpen}>
                    <EditIcon fontSize="small"/>
                </IconButton>
            </Tooltip>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle> Edit Car</DialogTitle>
                <CarDialogContent car={car} handleChange={handleChange}/>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave}> Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default EditCar;