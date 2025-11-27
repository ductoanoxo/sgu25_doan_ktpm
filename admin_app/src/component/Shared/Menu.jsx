import React, { useState, useContext } from 'react';
import {
    NavLink,
    Redirect
} from "react-router-dom";
import { AuthContext } from '../context/Auth'

function Menu() {
    const { user, jwt } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);

    // Menu items với quyền chi tiết
    const [menu, setMenu] = useState([
        {
            item: "Customer",
            permission: "Admin", // Chỉ Admin mới thấy
            requireAdmin: true
        },
        {
            item: "Coupon",
            permission: "Both", // Admin và Staff đều thấy
            requireAdmin: false
        },
        {
            item: "Product",
            permission: "Both", // Admin và Staff đều thấy
            requireAdmin: false
        },
        {
            item: "Sale",
            permission: "Both", // Admin và Staff đều thấy
            requireAdmin: false
        },
        {
            item: "Category",
            permission: "Both", // Admin và Staff đều thấy
            requireAdmin: false
        },
        {
            item: "Order",
            permission: "Both", // Admin và Staff đều thấy
            requireAdmin: false
        },
        {
            item: "ConfirmOrder",
            permission: "Both", // Admin và Staff đều thấy
            requireAdmin: false
        },
        {
            item: "Delivery",
            permission: "Both", // Admin và Staff đều thấy
            requireAdmin: false
        },
        {
            item: "ConfirmDelivery",
            permission: "Both", // Admin và Staff đều thấy
            requireAdmin: false
        },
        {
            item: "CompletedOrder",
            permission: "Both", // Admin và Staff đều thấy
            requireAdmin: false
        },
        {
            item: "CancelOrder",
            permission: "Both", // Admin và Staff đều thấy
            requireAdmin: false
        },
        {
            item: "User",
            permission: "Admin", // Chỉ Admin mới thấy
            requireAdmin: true
        },
        {
            item: "Permission",
            permission: "Admin", // Chỉ Admin mới thấy
            requireAdmin: true
        }
    ])

    let { pathname } = window.location;

    // Nếu chưa login thì redirect
    if (!jwt || !user) {
        return <Redirect to="/" />;
    }

    // Kiểm tra xem có phải Admin hoặc Staff không
    const userPermission = user?.id_permission;
    const isAdmin = userPermission?.isAdmin === true || userPermission?.permission === "Admin";
    const isStaff = userPermission?.isStaff === true || userPermission?.permission === "Nhân Viên";
    
    // Nếu không phải Admin hoặc Staff thì redirect (chặn customer)
    if (!isAdmin && !isStaff) {
        return <Redirect to="/" />;
    }

    // Filter menu dựa trên quyền của user
    const filteredMenu = menu.filter(item => {
        if (item.requireAdmin) {
            return isAdmin; // Chỉ Admin mới thấy
        }
        return true; // Admin và Staff đều thấy
    });

    // Nếu là Admin hoặc Staff thì hiển thị menu được filter
    return (
        <aside className="left-sidebar" data-sidebarbg="skin6">
            <div className="scroll-sidebar" data-sidebarbg="skin6">
                <nav className="sidebar-nav">
                    <ul id="sidebarnav">
                        <li className="list-divider"></li>
                        <li className="nav-small-cap">
                            <span className="hide-menu">
                                Management {isStaff && !isAdmin ? "(Nhân Viên)" : "(Admin)"}
                            </span>
                        </li>

                        <li className="sidebar-item">
                            <a
                                className={`sidebar-link has-arrow ${menuOpen ? 'active' : ''}`}
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    
                                    // Toggle menu state
                                    setMenuOpen(!menuOpen);
                                }}
                                aria-expanded={menuOpen}
                            >
                                <i data-feather="grid" className="feather-icon"></i>
                                <span className="hide-menu">Menu Quản Lý</span>
                            </a>
                            <ul aria-expanded={menuOpen} className={`collapse first-level base-level-line ${menuOpen ? 'show' : ''}`}>
                                {filteredMenu.map((item, index) => (
                                    <li className="sidebar-item" key={index}>
                                        <NavLink
                                            to={"/" + item.item.toLowerCase()}
                                            className="sidebar-link"
                                            activeClassName="active"
                                        >
                                            <span className="hide-menu">{item.item}</span>
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>
    );
}

export default Menu;
