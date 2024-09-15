import Carlist from "./components/Carlist.tsx";
import {describe, expect, test} from "vitest";
import {render, screen, waitFor} from "@testing-library/react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactNode} from "react";
import "@testing-library/jest-dom/vitest"
import userEvent from "@testing-library/user-event";
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false
        }
    }
});
const wrapper = ({children}: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
);
describe("Car List Test", () => {
    test("Component renders", () => {
        render(<Carlist/>, {wrapper});
        expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    })
    test("Cars are fetched", async () => {
        render(<Carlist/>, {wrapper});
        await waitFor( () => screen.getByText(/Add Car/i));
        expect(screen.getByText(/Ford/i)).toBeInTheDocument();
    })
    test("Open new car", async () => {
        render(<Carlist/>, {wrapper});
        await waitFor( () => screen.getByText(/Add Car/i));
        await userEvent.click(screen.getByText(/Add Car/i));
        expect(screen.getByText(/Save/i)).toBeInTheDocument();
    })
})