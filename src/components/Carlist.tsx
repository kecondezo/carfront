import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {deleteCar, getCars} from "../api/carapi.ts";
import {DataGrid, GridCellParams, GridColDef, GridToolbar} from "@mui/x-data-grid";
import {useState} from "react";
import {Button, IconButton, Snackbar, Stack} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCar from "./AddCar.tsx";
import EditCar from "./EditCar.tsx";

type CarlistProps = {
    logOut?: () => void;
}

function Carlist({logOut}: CarlistProps) {
    const [open, setOpen] = useState<boolean>(false);
    const queryClient = useQueryClient();
    const {data, error, isSuccess} = useQuery({
        queryKey: ["cars"],
        queryFn: getCars
    });

    const {mutate} = useMutation(
        {
            mutationFn: deleteCar,
            onSuccess: () => {
                setOpen(true);
                queryClient.invalidateQueries({queryKey: ['cars']})
            },
            onError: (err) => {
                console.error(err);
            },
        });

    const columns: GridColDef[] = [
        {field: 'brand', headerName: 'Brand', width: 200},
        {field: 'model', headerName: 'Model', width: 200},
        {field: 'color', headerName: 'Color', width: 200},
        {field: 'registrationNumber', headerName: 'Reg.nr.', width: 150},
        {field: 'modelYear', headerName: 'Model Year', width: 150},
        {field: 'price', headerName: 'Price', width: 150},
        {
            field: 'edit',
            headerName: '',
            width: 90,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params: GridCellParams) => (
                <EditCar cardata={params.row}/>
            )
        },
        {
            field: 'delete',
            headerName: '',
            width: 90,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params: GridCellParams) => (
                <IconButton
                    onClick={() => {
                        if (window.confirm(`Are you sure do you want to delete ${params.row.brand} ${params.row.model} `)
                        ) {
                            mutate(params.row._links.car.href)
                        }
                    }}>
                    <DeleteIcon fontSize="small"></DeleteIcon>
                </IconButton>
            )
        }
    ];

    if (!isSuccess) {
        return <span>Loading ....</span>
    } else if (error) {
        return <span>Error loading cars</span>
    } else {
        return (
            <>
                <Stack direction="row" alignItems="center"
                       justifyContent="space-between">
                    <AddCar/>
                    <Button onClick={logOut}>Log out</Button>
                </Stack>
                <DataGrid columns={columns}
                          rows={data}
                          disableRowSelectionOnClick={true}
                          getRowId={row => row._links.self.href}
                          slots={{toolbar: GridToolbar}}
                />
                <Snackbar
                    open={open}
                    autoHideDuration={2000}
                    onClose={() => setOpen(false)}
                    message="Car deleted"/>
            </>
        )
    }
}

export default Carlist;