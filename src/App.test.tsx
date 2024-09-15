import {describe, expect, test} from "vitest";
import App from "./App.tsx";
import {render, screen } from "@testing-library/react";
import '@testing-library/jest-dom/vitest'

describe("App Test", () => {
    test("Component renders", () => {
        render(<App />);
        expect(screen.getByText(/Car Shop/i)).toBeInTheDocument();
    })
})