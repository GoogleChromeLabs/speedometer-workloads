import { useDataContext } from "@/context/data-context";
import Dropdown from "../dropdown/dropdown";
import NavListItem from "./navlist-item";
import { usePathname } from "next/navigation";

import styles from "news-site-css/dist/navbar.module.css";

export default function NavList({ callback, id }) {
    const { content } = useDataContext();
    const pathname = usePathname();

    const navItems = [];
    const dropdownItems = [];

    Object.keys(content).forEach((key) => {
        if (content[key].priority === 1)
            navItems.push(key);
        else if (content[key].priority === 2)
            dropdownItems.push(key);
    });

    return (
        <ul className={styles["navbar-list"]}>
            {navItems.map((key) => <NavListItem id={`${id}-${key}-link`} key={key} label={content[key].name} url={content[key].url} callback={callback} isActive={pathname.split("/")[1] === key} />
            )}
            {dropdownItems.length > 0
                ? <li className={styles["navbar-item"]}>
                    <Dropdown animatedIconClass={styles["navbar-label-icon"]}>
                        {dropdownItems.map((key) =>
                            <NavListItem id={`${id}-${key}-link`} key={key} label={content[key].name} url={content[key].url} callback={callback} itemClass={styles["navbar-dropdown-item"]} isActive={pathname.split("/")[1] === key} />
                        )}
                    </Dropdown>
                </li>
                : null}
        </ul>
    );
}
