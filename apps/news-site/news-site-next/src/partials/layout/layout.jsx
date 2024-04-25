import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { HashLink } from "react-router-hash-link";

import Header from "../header/header";
import Navigation from "../navigation/navigation";
import Main from "../main/main";
import Footer from "../footer/footer";

import { useDataContext } from "@/context/data-context";
import { Message } from "@/components/message/message";

import styles from "news-site-css/dist/layout.module.css";
import { useRouter } from "next/router";

export default function Layout({ children, id }) {
    const [showMessage, setShowMessage] = useState(false);
    const { content, links } = useDataContext();
    const router = useRouter();

    function handleRouteChangeComplete(url) {
        window.dispatchEvent(new CustomEvent("route-change-complete", { detail: { url } }));
    }

    useEffect(() => {
        router.events.on("routeChangeComplete", handleRouteChangeComplete);

        return () => router.events.off("routeChangeComplete", handleRouteChangeComplete);
    }, []);

    useEffect(() => {
        setShowMessage(content[id].message);
    }, [content, id]);

    const pageRef = useRef(null);
    const pathname = usePathname();

    function closeMessage() {
        setShowMessage(false);
    }

    return (
        <>
            <HashLink to={`${pathname}#content`} className="skip-link">
                {links.a11y.skip.label}
            </HashLink>
            <div className={styles.page} ref={pageRef}>
                <Header />
                <Navigation />
                {showMessage ? <Message message={content[id].message} onClose={closeMessage} /> : null}
                <Main>{children}</Main>
                <Footer />
            </div>
        </>
    );
}
