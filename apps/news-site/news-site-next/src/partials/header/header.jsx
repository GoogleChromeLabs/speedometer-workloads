import Link from "next/link";
import TitleIcon from "@/assets/title-icon";

import styles from "news-site-css/dist/header.module.css";

export default function Header() {
    return (
        <header className={styles["page-header"]}>
            <Link href="/" className={styles["page-header-title"]}>
                <TitleIcon />
            </Link>
        </header>
    );
}
