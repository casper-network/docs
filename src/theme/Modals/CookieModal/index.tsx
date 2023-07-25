import Cookies from "js-cookie";
import React, { PropsWithChildren, ReactElement, useContext, useEffect, useRef, useState } from "react";
import useFocusTrap from "../../../hooks/useFocusTrap";
import icons from "../../../icons";
import styles from "./CookieModal.module.scss";
import { useLocation } from "@docusaurus/router";
import useLocaleMap from "../../../hooks/useLocaleMap";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { usePluginData } from "@docusaurus/useGlobalData";
import { ICookiesData } from "src/plugins/docusaurus-plugin-cookiesbanner/src/interfaces/cookieData";

interface IItem {
    name: string;
    value: boolean;
}

export interface IModalState {
    showCookieModal?: boolean;
    setShowCookieModal: (value: boolean) => void;
}

export const ModalContext = React.createContext<IModalState>({ showCookieModal: false, setShowCookieModal: () => undefined });

export function ModalContextContextProvider(props: PropsWithChildren<{}>): ReactElement {
    const [showCookieModal, setShowCookieModal] = useState<boolean>(false);
    const value = { showCookieModal, setShowCookieModal };
    const { children } = props;

    return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

function CookieModal() {
    const { showCookieModal, setShowCookieModal } = useContext(ModalContext);
    const [showNotice, setShowNotice] = useState<boolean>(false);
    const [showContent, setShowContent] = useState<boolean>(false);

    const [selected, setSelected] = useState<IItem[]>([]);

    const modalRef = useRef<HTMLDivElement>(null);

    const location = useLocation();
    const { siteConfig } = useDocusaurusContext();
    const { customFields } = siteConfig;
    const baseUrl = customFields.baseUrl as string;
    // -- Remove the base url from the location
    const path = location.pathname.replace(baseUrl, "");
    // -- Take the locale, if the locale isn't part of the path, the mapper is going to return the default external locale
    const internalLocale = path.split("/")[0];

    const externalLocale = useLocaleMap(internalLocale);

    const getCurrentDisplayed = () => {
        if (showNotice) {
            return "notice";
        }
        if (showContent) {
            return "content";
        }

        return "";
    };

    useFocusTrap(modalRef, `a[href], button:not([disabled]), .${styles.cookieCheckbox}`, showCookieModal, getCurrentDisplayed());

    const onCheck = (name: string) => {
        const copy = [...selected];
        const current = copy.find((x) => x.name === name)!;
        current.value = !current.value;

        setSelected([...copy]);
    };

    const getChecked = (name: string): boolean => {
        const current = selected.find((x) => x.name === name);
        return current?.value ?? false;
    };

    const data = usePluginData("docusaurus-plugin-cookiesbanner") as { cookieData: Array<ICookiesData> | undefined };

    const cookiesData =
        data?.cookieData.find((x) => x.languageCode === externalLocale) ||
        data?.cookieData.find((x) => x.languageCode === siteConfig.customFields.defaultExternalLocales);

    useEffect(() => {
        const prefs = Cookies.get("cookie-prefs");

        const values: Array<IItem> = [];
        const cookiesValues = prefs ? (JSON.parse(prefs) as Array<IItem>) : [];

        if (cookiesValues.length > 0) {
            setShowNotice(false);
            setShowContent(true);
        } else {
            setShowNotice(true);
            setShowContent(false);
            setShowCookieModal(true);
        }
        if (cookiesData) {
            for (const item of cookiesData.items) {
                const cookieValue = cookiesValues.find((x) => x.name === item!.parameter);
                values.push({ name: item!.parameter!, value: (cookieValue && cookieValue.value) || item!.required! });
            }
        }
        setSelected(values);
    }, []);

    useEffect(() => {
        if (document && document.body && showCookieModal && cookiesData) {
            document.body.classList.add("preventScrollDocument");
        } else {
            document.body.classList.remove("preventScrollDocument");
        }
    }, [showCookieModal]);

    const confirm = () => {
        const values = selected.map((x) => {
            return { name: x.name, value: x.value };
        });
        Cookies.set("cookie-prefs", JSON.stringify(values));
        window.location.reload();
    };

    const confirmAll = () => {
        const values = cookiesData?.items.map((x) => {
            return { name: x!.parameter!, value: true };
        });
        Cookies.set("cookie-prefs", JSON.stringify(values), { expires: 365 });
        window.location.reload();
    };

    const manage = () => {
        setShowNotice(false);
        setShowContent(true);
    };

    const handleKeyUp = (e: React.KeyboardEvent<HTMLLabelElement>, name: string) => {
        if (e.key.toLocaleLowerCase() === "enter") {
            onCheck(name);
        }
    };

    return (
        <>
            {cookiesData && (
                <div className={`${styles.modal} ${!showCookieModal ? styles.hidden : ""}`} ref={modalRef}>
                    {showNotice && (
                        <div className={styles.notice}>
                            <h2>{cookiesData?.notice_title}</h2>
                            <div dangerouslySetInnerHTML={{ __html: cookiesData?.notice_body ?? "" }} className="primaryParagraph"></div>
                            <div className={styles.buttons_container}>
                                <button onClick={manage} className={styles.btn_manage}>
                                    {cookiesData?.manage_button_text ?? ""}
                                </button>
                                <button onClick={confirmAll}>{cookiesData?.accept_all_button_text ?? ""}</button>
                            </div>
                        </div>
                    )}
                    {showContent && (
                        <div className={styles.content}>
                            <h2>{cookiesData?.manage_title}</h2>
                            <div
                                dangerouslySetInnerHTML={{ __html: cookiesData?.manage_body ?? "" }}
                                className={`primaryParagraph ${styles.content_text}`}
                            ></div>
                            <div className={styles.content_items}>
                                {cookiesData?.items?.map((x) => {
                                    return (
                                        <div key={x!.title!} className={styles.item}>
                                            <div className={styles.input_container}>
                                                <p className="primaryParagraph">{x?.title}</p>

                                                <input
                                                    type="checkbox"
                                                    id={`cookie-${x?.title}`}
                                                    className={styles.cookieInput}
                                                    disabled={x?.required ?? false}
                                                    checked={getChecked(x!.parameter!)}
                                                    onChange={() => {
                                                        onCheck(x!.parameter!);
                                                    }}
                                                />

                                                <label
                                                    htmlFor={`cookie-${x?.title}`}
                                                    tabIndex={0}
                                                    className={` ${styles.cookieCheckbox} ${x?.required ? styles.cookieCheckboxDisabled : ""}`}
                                                    onKeyUp={(e) => handleKeyUp(e, x!.parameter!)}
                                                >
                                                    {icons.check}
                                                </label>
                                            </div>
                                            <div
                                                dangerouslySetInnerHTML={{ __html: x?.description ?? "" }}
                                                className={`secondaryParagraph ${styles.item_text}`}
                                            ></div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className={styles.buttons_container}>
                                <button onClick={confirm}>{cookiesData?.confirm_button_text ?? ""}</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

export default CookieModal;
