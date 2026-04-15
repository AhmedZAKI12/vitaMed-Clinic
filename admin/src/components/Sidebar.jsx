import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { DoctorContext } from "../context/DoctorContext";
import { AdminContext } from "../context/AdminContext";

import {
  LayoutDashboard,
  CalendarDays,
  UserPlus,
  Users,
  User
} from "lucide-react";

const Sidebar = () => {
  const { dToken } = useContext(DoctorContext);
  const { aToken } = useContext(AdminContext);

    const linkClass = ({ isActive }) =>
      `group flex items-center gap-3 px-5 py-3 rounded-xl
      transition-all duration-200 ease-out
      ${isActive
        ? "bg-white/10 text-white shadow-inner ring-1 ring-white/10"
        : "text-slate-300 hover:text-white hover:bg-white/5 hover:translate-x-1"}`;

  const iconClass = "transition-transform duration-200 group-hover:scale-110";

  return (
    <aside
className="
min-h-screen
w-64
bg-gradient-to-b
from-slate-950
via-slate-900
to-slate-950
border-r
border-white/10
p-4
shadow-xl
overflow-y-auto
"
>

      {/* ADMIN MENU */}
      {aToken && (
        <ul className="flex flex-col gap-2 mt-2">

          <NavLink to="/admin-dashboard" className={linkClass}>
            <LayoutDashboard size={18} className={iconClass}/>
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/all-appointments" className={linkClass}>
            <CalendarDays size={18} className={iconClass}/>
            <span>Appointments</span>
          </NavLink>

          <NavLink to="/add-doctor" className={linkClass}>
            <UserPlus size={18} className={iconClass}/>
            <span>Add Doctor</span>
          </NavLink>

          <NavLink to="/doctor-list" className={linkClass}>
            <Users size={18} className={iconClass}/>
            <span>Doctors List</span>
          </NavLink>

        </ul>
      )}

      {/* DOCTOR MENU */}
      {dToken && (
        <ul className="flex flex-col gap-2 mt-2">

          <NavLink to="/doctor-dashboard" className={linkClass}>
            <LayoutDashboard size={18} className={iconClass}/>
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/doctor-appointments" className={linkClass}>
            <CalendarDays size={18} className={iconClass}/>
            <span>Appointments</span>
          </NavLink>

          <NavLink to="/doctor-profile" className={linkClass}>
            <User size={18} className={iconClass}/>
            <span>Profile</span>
          </NavLink>

        </ul>
      )}
    </aside>
  );
};

export default Sidebar;