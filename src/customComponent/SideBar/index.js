import React, { useRef, useEffect ,useContext} from "react";
import { Link } from "react-router-dom";

import { ProfileContext } from "../../context/ProfileProvider";

import { useNavigate } from "react-router-dom";

const SideBar = () => {
    const messagesEndRef = useRef(null)
    useEffect(() => {
        scrollTop()
    }, []);
    const scrollTop = () => {
        messagesEndRef?.current?.scrollIntoView(true)
    }
    const [profileState, updateProfileState] = useContext(ProfileContext);
    const navigate = useNavigate();
    const handleLogOut = () => {
        updateProfileState({});
        localStorage.clear();
        navigate("/login");
        window.location.reload();
    
      }

    return (
        <>
            <div className="sidepanel  sidepanel_fixed">
                <ul className="settings_bar explore-style-one explore-style-overlay border-gradient ">
                    <li>                    
                        <Link className="ss_link" to="/profile">
                            <i className="ri-user-line"></i> Profile
                        </Link>
                    </li>
                    <li>
                        <Link className="ss_link" to="/my_collection">
                            <i className="ri-layout-grid-line"></i>My Collection
                        </Link>
                    </li>
                    <li>
                        <Link className="ss_link" to="/new_nft">
                            <i className="ri-edit-line"></i> Create NFT
                        </Link>
                    </li>
                    <li>
                        <Link className="ss_link " to="/settings">
                            <i class="ri-settings-line"></i> Settings
                        </Link>
                    </li>
                    <li>
                        <Link className="ss_link " to="/notifications">
                            <i class="ri-notification-4-line"></i> Notifications
                        </Link>
                    </li>
                    <li>
                        <Link className="ss_link text-danger" to="#"  onClick={() => handleLogOut()}>
                            {" "}
                            <i class="ri-shut-down-line"></i> Logout
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default SideBar;
