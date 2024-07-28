import { Route, Routes as BrowserRoutes } from "react-router-dom";
import React, { useContext, useEffect } from "react";
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
import EditBill from "./pages/EditBill";
import Login from "./pages/Login";
import ProtectedRoutes from "./components/ProtectedRoutes";
import ChangePassword from "./pages/ChangePassword";
import ShowUsers from "./pages/ShowUsers";
import CreateUser from "./pages/CreateUser";
import EditUser from "./pages/EditUser";
import CreateSuperUser from "./pages/CreateSuperUser";

const Routes = () => {
    return (
        <BrowserRoutes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="/all-products" element={<AllData />} />
                <Route path="/product/:id" element={<Product />} />
                <Route path="/add-product" element={<AddSingleProduct />} />
                <Route path="/saved-bills" element={<SavedBills />} />
                <Route path="/bill/:id" element={<ViewBill />} />
                <Route path="/login" element={<Login />} />
                <Route path="/show-users" element={<ShowUsers />} />
                <Route path="/create-super-user" element={<CreateSuperUser />} />

                <Route
                    path="/change-password"
                    element={
                        <ProtectedRoutes>
                            <ChangePassword />
                        </ProtectedRoutes>
                    }
                />
                <Route
                    path="/user/edit/:id"
                    element={
                        <ProtectedRoutes>
                            <EditUser />
                        </ProtectedRoutes>
                    }
                />
                <Route
                    path="/create-user"
                    element={
                        <ProtectedRoutes>
                            <CreateUser />
                        </ProtectedRoutes>
                    }
                />
                <Route
                    path="/edit/:id"
                    element={
                        <ProtectedRoutes>
                            <EditProduct />
                        </ProtectedRoutes>
                    }
                />
                <Route
                    path="/import-excel"
                    element={
                        <ProtectedRoutes>
                            <ImportExcel />
                        </ProtectedRoutes>
                    }
                />
                <Route
                    path="/backup-restore"
                    element={
                        <ProtectedRoutes>
                            <BackupRestore />
                        </ProtectedRoutes>
                    }
                />
                <Route
                    path="/edit-bill"
                    element={
                        <ProtectedRoutes>
                            <EditBill />
                        </ProtectedRoutes>
                    }
                />

                <Route path="*" element={<NotFound />} />
            </Route>
        </BrowserRoutes>
    );
};

export default Routes;
