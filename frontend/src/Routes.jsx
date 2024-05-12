import { Route, Routes as BrowserRoutes } from "react-router-dom";
import React from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import AllData from "./pages/AllData";
import Product from "./pages/Product";
import ImportExcel from "./pages/ImportExcel";
import BackupRestore from "./pages/BackupRestore";
import AddSingleProduct from "./pages/AddSingleProduct";
import EditProduct from "./pages/EditProduct";
import { NotFound } from "./pages/NotFound";
import SavedBills from "./pages/SavedBills";
import ViewBill from "./pages/ViewBill";

const Routes = () => {
    return (
        <BrowserRoutes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="/all-products" element={<AllData />} />
                <Route path="/product/:id" element={<Product />} />
                <Route path="/edit/:id" element={<EditProduct />} />
                <Route path="/import-excel" element={<ImportExcel />} />
                <Route path="/backup-restore" element={<BackupRestore />} />
                <Route path="/add-product" element={<AddSingleProduct />} />
                <Route path="/saved-bills" element={<SavedBills />} />
                <Route path="/bill/:id" element={<ViewBill />} />

                <Route path="*" element={<NotFound />} />
            </Route>
        </BrowserRoutes>
    );
};

export default Routes;
