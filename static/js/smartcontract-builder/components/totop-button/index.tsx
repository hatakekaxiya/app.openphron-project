import { useEffect, useState } from "react";
import { ArrowUpward } from "@mui/icons-material";
import "./style.scss";

const ToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        window.addEventListener("scroll", () => {
            setIsVisible(window.scrollY > 10);
        });
    }, []);

    return (
        isVisible ? (
            <div className="to-top-button" onClick={() => {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }}>
                <ArrowUpward />
            </div>
        ) : null
    );
};

export default ToTopButton;