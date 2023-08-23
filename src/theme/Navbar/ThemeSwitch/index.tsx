import React, { useEffect, useState } from "react";
import icons from "../../../icons";
import styles from "./ThemeSwitch.module.scss";
import { useColorMode, useThemeConfig } from "@docusaurus/theme-common";
function ThemeSwitch() {
    const disabled = useThemeConfig().colorMode.disableSwitch;
    const { colorMode, setColorMode } = useColorMode();
    const [isLightTheme, setIsLightTheme] = useState<boolean | undefined>(undefined);
    if (disabled) {
        return null;
    }
    function handleThemeChange() {
        setColorMode(colorMode === "light" ? "dark" : "light");
    }

    useEffect(() => {
        setIsLightTheme(colorMode === "light");
    }, [colorMode]);

    return (
        <div className={styles.switchWrapper}>
            {isLightTheme !== undefined ? (
                <>
                    <label htmlFor="switch" className={isLightTheme ? styles.light : "dark"}>
                        {isLightTheme ? icons.sun : icons.moon}
                    </label>
                    <input id="switch" type="checkbox" aria-hidden="true" onChange={handleThemeChange}></input>
                </>
            ) : null}
        </div>
    );
}

export default ThemeSwitch;
